"""Replication of the DiabetesSense Random Forest benchmark.

Dataset: BRFSS 2015 (diabetes_binary_health_indicators_BRFSS2015.csv,
253,680 rows, 21 features + binary target, ~86/14 class imbalance).

Two protocols are run:
  A) As described in the write-up: Random Over-Sampling to 50/50 on the FULL
     dataset, then an 80/20 split. Because ROS duplicates minority rows,
     copies of the same record land in both train and test.
  B) Leak-free control: 80/20 split first, ROS applied to the training set
     only, evaluated on the untouched imbalanced test set.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split

SEED = 42
CSV = r"F:\Projects\AI\diabetes_app\diabetes_dataset\diabetes_binary_health_indicators_BRFSS2015.csv"

# BRFSS _AGEG5YR codes
AGE_BANDS = {1: "18-24", 2: "25-29", 3: "30-34", 4: "35-39", 5: "40-44",
             6: "45-49", 7: "50-54", 8: "55-59", 9: "60-64", 10: "65-69",
             11: "70-74", 12: "75-79", 13: "80+"}


def random_oversample(X: pd.DataFrame, y: pd.Series, seed: int):
    """Plain Random Over-Sampling: duplicate minority rows to a 50/50 balance."""
    rng = np.random.RandomState(seed)
    counts = y.value_counts()
    minority, majority = counts.idxmin(), counts.idxmax()
    idx_min = y.index[y == minority]
    extra = rng.choice(idx_min, size=counts[majority] - counts[minority], replace=True)
    keep = np.concatenate([y.index.to_numpy(), extra])
    return X.loc[keep].reset_index(drop=True), y.loc[keep].reset_index(drop=True)


def evaluate(name: str, model, X_test, y_test):
    pred = model.predict(X_test)
    proba = model.predict_proba(X_test)[:, 1]
    tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
    acc = accuracy_score(y_test, pred)
    sens = tp / (tp + fn)
    spec = tn / (tn + fp)
    auc = roc_auc_score(y_test, proba)
    print(f"\n{name}")
    print(f"  Accuracy    : {acc * 100:6.2f} %")
    print(f"  Sensitivity : {sens * 100:6.2f} %")
    print(f"  Specificity : {spec * 100:6.2f} %")
    print(f"  AUC         : {auc:.4f}")
    return acc, sens, spec, auc


def main():
    df = pd.read_csv(CSV)
    y = df["Diabetes_binary"].astype(int)
    X = df.drop(columns=["Diabetes_binary"])
    n_pos, n_neg = (y == 1).sum(), (y == 0).sum()
    print(f"Records: {len(df):,}  Features: {X.shape[1]}")
    print(f"Class balance: {n_neg:,} non-diabetic / {n_pos:,} diabetic "
          f"({n_neg / len(df) * 100:.1f}/{n_pos / len(df) * 100:.1f})")

    print("\nPearson correlation with diabetes status (claimed values in write-up):")
    claimed = {"HighBP": +0.38, "HighChol": +0.29, "BMI": +0.29, "Age": +0.27,
               "PhysHlth": +0.21, "PhysActivity": -0.09, "Education": -0.15,
               "Income": -0.19, "GenHlth": -0.41}
    corr = df.corr(numeric_only=True)["Diabetes_binary"]
    for feat, claim in claimed.items():
        print(f"  {feat:<14} measured {corr[feat]:+.2f}   claimed {claim:+.2f}")

    print("\nDiabetes prevalence by age band:")
    Xb, yb = random_oversample(X, y, SEED)
    balanced = pd.concat([Xb, yb.rename("Diabetes_binary")], axis=1)
    raw_prev = df.groupby("Age")["Diabetes_binary"].mean()
    bal_prev = balanced.groupby("Age")["Diabetes_binary"].mean()
    for code in sorted(AGE_BANDS):
        print(f"  {AGE_BANDS[code]:<6} raw {raw_prev.get(code, float('nan')) * 100:5.1f} %"
              f"   after 50/50 ROS {bal_prev.get(code, float('nan')) * 100:5.1f} %")

    rf_params = dict(n_estimators=100, random_state=SEED, n_jobs=-1)

    # Protocol A: oversample the full dataset, then split (as in the write-up)
    Xa_tr, Xa_te, ya_tr, ya_te = train_test_split(
        Xb, yb, test_size=0.20, random_state=SEED, stratify=yb)
    rf_a = RandomForestClassifier(**rf_params).fit(Xa_tr, ya_tr)
    evaluate("Protocol A - ROS before split (write-up's protocol)", rf_a, Xa_te, ya_te)
    dup = pd.merge(Xa_te.assign(y=ya_te.values).drop_duplicates(),
                   Xa_tr.assign(y=ya_tr.values).drop_duplicates(), how="inner")
    print(f"  Test rows also present in train: {len(dup):,} unique records "
          f"({len(dup) / Xa_te.drop_duplicates().shape[0] * 100:.1f} % of unique test rows)")

    # Protocol B: split first, oversample the training set only
    Xb_tr, Xb_te, yb_tr, yb_te = train_test_split(
        X, y, test_size=0.20, random_state=SEED, stratify=y)
    Xb_tr_ros, yb_tr_ros = random_oversample(Xb_tr, yb_tr, SEED)
    rf_b = RandomForestClassifier(**rf_params).fit(Xb_tr_ros, yb_tr_ros)
    evaluate("Protocol B - split first, ROS on train only (leak-free)", rf_b, Xb_te, yb_te)


if __name__ == "__main__":
    main()
