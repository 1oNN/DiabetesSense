"""Full replication of the thesis benchmark (Ahmad & Javed, 2024).

Protocol as described in the thesis:
  - BRFSS 2015 binary dataset (253,680 rows, 21 features + target)
  - Fruits and Veggies dropped (Section 2.7)
  - Balance the full dataset (ROS / SMOTE / ADASYN), then 80/20 split
  - 11 models with the parameters from Table 2.2
  - Metrics: accuracy, sensitivity, specificity, AUC (Section 2.8)

Usage: python thesis_replication.py [ROS|SMOTE|ADASYN]
Results are cached per model in results_<technique>.json, so the script can
be re-run and will skip models that are already done.
"""

import gc
import json
import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd
from imblearn.over_sampling import ADASYN, SMOTE, RandomOverSampler
from sklearn.ensemble import (AdaBoostClassifier, GradientBoostingClassifier,
                              RandomForestClassifier)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, confusion_matrix, roc_auc_score,
                             roc_curve)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

SEED = 42
# This machine runs close to its commit limit; parallel tree building keeps a
# copy of the forest per worker, so keep the worker count low deliberately.
N_JOBS = 2
HERE = Path(__file__).parent
CSV = HERE.parent / "diabetes_dataset" / "diabetes_binary_health_indicators_BRFSS2015.csv"

SAMPLERS = {
    "ROS": RandomOverSampler(random_state=SEED),
    "SMOTE": SMOTE(random_state=SEED),
    "ADASYN": ADASYN(random_state=SEED),
}


def build_models():
    """Table 2.2 of the thesis, adapted to current library versions."""
    from catboost import CatBoostClassifier
    from lightgbm import LGBMClassifier
    from xgboost import XGBClassifier
    return {
        "Random Forest": RandomForestClassifier(
            n_estimators=100, criterion="gini", random_state=SEED, n_jobs=N_JOBS),
        "Decision Tree": DecisionTreeClassifier(
            criterion="gini", splitter="best", max_depth=None, random_state=SEED),
        "KNN": KNeighborsClassifier(
            n_neighbors=5, algorithm="auto", metric="minkowski", n_jobs=N_JOBS),
        "CatBoost": CatBoostClassifier(
            verbose=0, iterations=1000, learning_rate=0.03, depth=6,
            random_seed=SEED),
        "XGBoost": XGBClassifier(
            eval_metric="logloss", booster="gbtree", random_state=SEED, n_jobs=N_JOBS),
        "LightGBM": LGBMClassifier(
            boosting_type="gbdt", num_leaves=31, learning_rate=0.1,
            random_state=SEED, n_jobs=N_JOBS, verbose=-1),
        "Neural Network": MLPClassifier(
            hidden_layer_sizes=(50,), max_iter=1000, activation="relu",
            random_state=SEED),
        "GBM": GradientBoostingClassifier(
            n_estimators=100, learning_rate=0.1, random_state=SEED),
        "AdaBoost": AdaBoostClassifier(
            estimator=DecisionTreeClassifier(max_depth=1), n_estimators=100,
            random_state=SEED),
        "Logistic Regression": LogisticRegression(
            max_iter=1000, penalty="l2", solver="lbfgs", random_state=SEED),
        "Naive Bayes": GaussianNB(),
    }


def load_split(technique: str):
    df = pd.read_csv(CSV)
    df = df.drop(columns=["Fruits", "Veggies"])  # Section 2.7
    y = df["Diabetes_binary"].astype(int)
    X = df.drop(columns=["Diabetes_binary"])
    Xb, yb = SAMPLERS[technique].fit_resample(X, y)
    X_tr, X_te, y_tr, y_te = train_test_split(
        Xb, yb, test_size=0.20, random_state=SEED, stratify=yb)
    scaler = StandardScaler().fit(X_tr)
    out = (scaler.transform(X_tr).astype(np.float32),
           scaler.transform(X_te).astype(np.float32),
           y_tr.to_numpy(), y_te.to_numpy())
    del df, X, y, Xb, yb, X_tr, X_te
    gc.collect()
    return out


def main(technique: str):
    out_path = HERE / f"results_{technique}.json"
    results = json.loads(out_path.read_text()) if out_path.exists() else {}
    models = build_models()
    todo = [n for n in models if n not in results]
    print(f"[{technique}] cached: {len(results)}  to run: {len(todo)}", flush=True)
    if not todo:
        return

    X_tr, X_te, y_tr, y_te = load_split(technique)
    print(f"[{technique}] train {X_tr.shape}  test {X_te.shape}", flush=True)

    for name in todo:
        t0 = time.time()
        model = models.pop(name).fit(X_tr, y_tr)
        pred = model.predict(X_te)
        proba = model.predict_proba(X_te)[:, 1]
        tn, fp, fn, tp = confusion_matrix(y_te, pred).ravel()
        fpr, tpr, _ = roc_curve(y_te, proba)
        idx = np.linspace(0, len(fpr) - 1, min(len(fpr), 200)).astype(int)
        results[name] = {
            "accuracy": accuracy_score(y_te, pred),
            "sensitivity": tp / (tp + fn),
            "specificity": tn / (tn + fp),
            "auc": roc_auc_score(y_te, proba),
            "confusion": [int(tn), int(fp), int(fn), int(tp)],
            "roc_fpr": fpr[idx].round(4).tolist(),
            "roc_tpr": tpr[idx].round(4).tolist(),
            "train_seconds": round(time.time() - t0, 1),
        }
        out_path.write_text(json.dumps(results, indent=1))
        del model, pred, proba
        gc.collect()
        r = results[name]
        print(f"[{technique}] {name:<20} acc {r['accuracy']*100:6.2f}%  "
              f"sens {r['sensitivity']*100:6.2f}%  spec {r['specificity']*100:6.2f}%  "
              f"AUC {r['auc']:.4f}  ({r['train_seconds']}s)", flush=True)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "ROS")
