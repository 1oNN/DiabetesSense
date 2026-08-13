# Replicated model results

Thesis protocol: resample the full dataset to 50/50, then split 80/20.

## ROS

| Model | Accuracy | Sensitivity | Specificity |
|---|---|---|---|
| Random Forest | 94.02% | 98.90% | 89.14% |
| Decision Tree | 92.14% | 98.72% | 85.57% |
| KNN | 83.50% | 95.29% | 71.72% |
| XGBoost | 76.70% | 81.74% | 71.66% |
| CatBoost | 76.08% | 80.82% | 71.35% |
| LightGBM | 75.74% | 80.76% | 70.72% |
| Neural Network | 75.66% | 78.86% | 72.45% |
| GBM | 75.32% | 79.61% | 71.04% |
| AdaBoost | 74.73% | 76.48% | 72.98% |
| Logistic Regression | 74.66% | 76.72% | 72.60% |
| Naive Bayes | 71.80% | 70.70% | 72.90% |

## SMOTE

| Model | Accuracy | Sensitivity | Specificity |
|---|---|---|---|
| CatBoost | 91.76% | 86.19% | 97.33% |
| Random Forest | 91.61% | 88.10% | 95.11% |
| XGBoost | 91.56% | 86.01% | 97.11% |
| LightGBM | 91.35% | 86.31% | 96.40% |
| GBM | 88.80% | 87.26% | 90.35% |
| Decision Tree | 87.73% | 88.18% | 87.29% |
| Neural Network | 86.37% | 83.34% | 89.41% |
| AdaBoost | 85.99% | 85.38% | 86.61% |
| KNN | 85.79% | 89.60% | 81.97% |
| Logistic Regression | 75.46% | 78.06% | 72.86% |
| Naive Bayes | 73.19% | 79.35% | 67.02% |

## ADASYN

| Model | Accuracy | Sensitivity | Specificity |
|---|---|---|---|
| CatBoost | 91.67% | 85.69% | 97.49% |
| Random Forest | 91.52% | 87.70% | 95.24% |
| XGBoost | 91.42% | 85.36% | 97.30% |
| LightGBM | 91.33% | 85.65% | 96.85% |
| GBM | 88.62% | 86.47% | 90.72% |
| Decision Tree | 87.66% | 88.06% | 87.28% |
| Neural Network | 85.68% | 80.74% | 90.48% |
| KNN | 85.32% | 89.53% | 81.23% |
| AdaBoost | 85.30% | 84.95% | 85.64% |
| Logistic Regression | 73.70% | 76.05% | 71.42% |
| Naive Bayes | 71.57% | 79.28% | 64.07% |
