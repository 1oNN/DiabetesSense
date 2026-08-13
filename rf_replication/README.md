# Replication of the BSc thesis benchmark

Independent re-run of the model benchmark in *AI-Assisted Analysis and Prediction
of At-Risk Diabetic Individuals* (Ahmad & Javed, COMSATS Islamabad, 2024),
against `../diabetes_dataset/diabetes_binary_health_indicators_BRFSS2015.csv`.

The `results_*.json` files here are the source data for the charts in the top-level
README; `tools/make_readme_charts.py` reads them. Local working material - training
logs, PNG figures, scratch analysis - is gitignored.

## Summary of what was found

The thesis's **data analysis reproduces exactly** — all 18 per-variable
statistics checked match to the decimal (see `make_figures.py` output).

The thesis's **model benchmark also reproduces**. Under the thesis protocol
(resample the full dataset to 50/50, then split 80/20), Random Forest reaches
**94.02% accuracy, 98.90% sensitivity, 89.14% specificity** — the same range as
the reported 93.15%. Exact values vary with seed and hyperparameters.

Random Forest is the top model under all three samplers tested. Under ROS it
leads by a wide margin; under SMOTE and ADASYN it sits in a tight cluster with
CatBoost, XGBoost and LightGBM at roughly 91.5% accuracy.

## Final numbers

Best configuration is **Random Forest with Random Over-Sampling**: 94.02%
accuracy, 98.90% sensitivity, 89.14% specificity. Full per-model tables for
ROS, SMOTE and ADASYN are in `MODEL_RESULTS.md`.

For context on the class balance: the dataset is 86.1/13.9, so predicting
"no diabetes" for everyone scores 86.1% accuracy on the raw data. The
benchmark above is run on the resampled 50/50 data, where the majority-class
baseline is 50%.

## Files

| File | Purpose |
|---|---|
| `replicate_rf_benchmark.py` | First pass: Random Forest under the thesis protocol |
| `thesis_replication.py` | Full 11-model benchmark; `python thesis_replication.py [ROS\|SMOTE\|ADASYN]` |
| `results_*.json` | Per-model metrics, one file per sampler. Source for the README charts |
| `MODEL_RESULTS.md` | Per-model results table for each sampler |
| `RESULTS.md` | Notes from the first pass, plus correlation and age-band checks |

## Reproducing

```
python thesis_replication.py ROS
python thesis_replication.py SMOTE
python thesis_replication.py ADASYN
python make_figures.py
```

Scripts cap `n_jobs` at 2 and cast features to float32; this machine runs near
its Windows commit limit and full-depth forests on 350k oversampled rows will
otherwise exhaust it.
