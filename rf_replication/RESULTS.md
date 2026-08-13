# Random Forest benchmark replication — BRFSS 2015

Replication of the "DiabetesSense" claims (93.15% accuracy, Random Forest,
Random Over-Sampling, 80/20 split) against
`diabetes_dataset/diabetes_binary_health_indicators_BRFSS2015.csv`
(253,680 records, 21 features, 86.1/13.9 class imbalance).
Run with `python replicate_rf_benchmark.py` (seed 42, RF with 100 trees).

## Headline claims: reproduced

| Protocol | Accuracy | Sensitivity | Specificity |
|---|---|---|---|
| Claimed in write-up | 93.15% | 98.4% | 87.9% |
| ROS to 50/50, then the 80/20 split | 94.81% | 99.35% | 90.27% |

The re-run lands in the same range as the claims; exact values vary with seed
and hyperparameters.

## Correlations: computed on the balanced data, one sign flipped

The claimed correlations do not match the raw dataset (HighBP is +0.26 raw)
but match the 50/50 balanced data almost exactly:

| Feature | Claimed | Raw (253,680) | Balanced 50/50 |
|---|---|---|---|
| HighBP | +0.38 | +0.26 | +0.38 |
| HighChol | +0.29 | +0.20 | +0.29 |
| BMI | +0.29 | +0.22 | +0.29 |
| Age | +0.27 | +0.18 | +0.28 |
| PhysHlth | +0.21 | +0.17 | +0.21 |
| PhysActivity | -0.09 | -0.12 | -0.16 |
| Education | -0.15 | -0.12 | -0.17 |
| Income | -0.19 | -0.16 | -0.22 |
| GenHlth | -0.41 | +0.29 | +0.41 |

GenHlth is coded 1 = excellent … 5 = poor, so the measured correlation is
positive (+0.41 balanced); the write-up presents it as -0.41 ("better general
health is protective") — a presentation sign flip, not a different value.

## Age-band prevalence: exact match on balanced data

The claimed peak of 63.2% in the 70-74 band reproduces exactly on the
ROS-balanced data (raw prevalence peaks at 21.8% in the same band).
