from __future__ import annotations

import random
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.impute import KNNImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline as SkPipeline
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from ml.preprocessing import feature_cols, make_features

warnings.filterwarnings("ignore")

RANDOM_STATE = 42
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "diabetes_health_indicators.csv"
ARTIFACT_DIR = BASE_DIR / "artifacts"
FINAL_PIPELINE_PATH = ARTIFACT_DIR / "final_pipeline.joblib"
FEATURE_COLS_PATH = ARTIFACT_DIR / "feature_cols.joblib"

try:
    from xgboost import XGBClassifier
except ImportError:
    XGBClassifier = None

try:
    from lightgbm import LGBMClassifier
except ImportError:
    LGBMClassifier = None

try:
    from catboost import CatBoostClassifier
except ImportError:
    CatBoostClassifier = None

# Keep the random seed fixed so model comparisons are reproducible across runs
def set_seed(seed: int = RANDOM_STATE) -> None:
    random.seed(seed)
    np.random.seed(seed)

def load_dataset(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")
    return pd.read_csv(path)

def build_preprocessor(feature_names: list[str]) -> ColumnTransformer:
    numeric_transformer = Pipeline(
        [
            ("imputer", KNNImputer(n_neighbors=6)),
            ("scaler", StandardScaler()),
        ]
    )

    return ColumnTransformer(
        [("num", numeric_transformer, feature_names)],
        remainder="drop",
    )

def build_models() -> dict[str, object]:
    models: dict[str, object] = {
        "LogisticRegression": LogisticRegression(
            class_weight="balanced",
            max_iter=2000,
            random_state=RANDOM_STATE,
        ),
        "DecisionTree": DecisionTreeClassifier(
            class_weight="balanced",
            random_state=RANDOM_STATE,
        ),
        "RandomForest": RandomForestClassifier(
            n_estimators=100,
            class_weight="balanced",
            random_state=RANDOM_STATE,
            n_jobs=1,
        ),
        "ExtraTrees": ExtraTreesClassifier(
            n_estimators=100,
            class_weight="balanced",
            random_state=RANDOM_STATE,
            n_jobs=1,
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=100,
            random_state=RANDOM_STATE,
        ),
        "MLP": MLPClassifier(
            hidden_layer_sizes=(64, 32),
            max_iter=500,
            random_state=RANDOM_STATE,
        ),
    }

    if XGBClassifier is not None:
        models["XGBoost"] = XGBClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            random_state=RANDOM_STATE,
            n_jobs=1,
            eval_metric="auc",
            verbosity=0,
        )

    if LGBMClassifier is not None:
        models["LightGBM"] = LGBMClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            random_state=RANDOM_STATE,
            n_jobs=1,
            verbose=-1,
        )

    if CatBoostClassifier is not None:
        models["CatBoost"] = CatBoostClassifier(
            iterations=200,
            learning_rate=0.05,
            depth=5,
            random_seed=RANDOM_STATE,
            verbose=0,
        )

    return models

def compare_models(x_train: pd.DataFrame, y_train: pd.Series, preprocessor: ColumnTransformer) -> pd.DataFrame:
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    rows: list[dict[str, float | str]] = []

    # Wrap preprocessing and the classifier together to avoid leakage during cross-validation
    for name, estimator in build_models().items():
        print(f"Running CV for {name} ...", end=" ")
        pipe = SkPipeline([("preproc", preprocessor), ("clf", estimator)])
        scores = cross_val_score(pipe, x_train, y_train, cv=cv, scoring="roc_auc", n_jobs=1)
        rows.append(
            {
                "Model": name,
                "ROC_AUC_mean": float(np.mean(scores)),
                "ROC_AUC_std": float(np.std(scores)),
            }
        )
        print(f"done. mean ROC_AUC = {np.mean(scores):.4f}, std = {np.std(scores):.4f}")

    return pd.DataFrame(rows).sort_values("ROC_AUC_mean", ascending=False).reset_index(drop=True)

def evaluate_pipeline(
    pipeline: SkPipeline,
    x_test_raw: pd.DataFrame,
    y_test: pd.Series,
) -> dict[str, float]:
    y_pred = pipeline.predict(x_test_raw)
    y_proba = pipeline.predict_proba(x_test_raw)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred),
        "recall": recall_score(y_test, y_pred),
        "f1": f1_score(y_test, y_pred),
        "roc_auc": roc_auc_score(y_test, y_proba),
    }

    print("\nHoldout Test metrics:")
    print(f"Accuracy : {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall   : {metrics['recall']:.4f}")
    print(f"F1       : {metrics['f1']:.4f}")
    print(f"ROC-AUC  : {metrics['roc_auc']:.4f}")

    return metrics

def main() -> None:
    set_seed()

    df = load_dataset(DATA_PATH)
    if "Diabetes_binary" not in df.columns:
        raise ValueError("Expected target column 'Diabetes_binary' was not found in the dataset.")

    print("Rows, cols:", df.shape)
    print(df.head())
    print("\nClass counts:")
    print(df["Diabetes_binary"].value_counts().sort_index())
    print("Neg/Pos ratio:", df["Diabetes_binary"].value_counts().iloc[0] / df["Diabetes_binary"].value_counts().iloc[1])

    y = df["Diabetes_binary"].astype(int)
    raw_train_df, raw_test_df, y_train, y_test = train_test_split(
        df,
        y,
        test_size=0.20,
        stratify=y,
        random_state=RANDOM_STATE,
    )

    x_train = make_features(raw_train_df)
    x_test = make_features(raw_test_df)
    print("X shape:", x_train.shape)
    print("Engineered: Train:", x_train.shape, "Test:", x_test.shape)
    print("Raw rows:    Train:", raw_train_df.shape, "Test:", raw_test_df.shape)

    preprocessor = build_preprocessor(x_train.columns.tolist())
    results_df = compare_models(x_train, y_train, preprocessor)
    print("\nSummary (sorted by mean ROC-AUC):")
    print(results_df.to_string(index=False))

    best_name = results_df.loc[0, "Model"]
    print("\nBest model by CV ROC-AUC:", best_name)
    best_estimator = build_models()[best_name]

    feat_transformer = FunctionTransformer(make_features, validate=False)
    final_pipeline = SkPipeline(
        [
            ("feat", feat_transformer),
            ("preproc", preprocessor),
            ("clf", best_estimator),
        ]
    )
    print(final_pipeline)

    print("\nFitting final pipeline on raw train rows and evaluating on raw test rows...")
    final_pipeline.fit(raw_train_df, y_train)
    evaluate_pipeline(final_pipeline, raw_test_df, y_test)

    print("\nFitting final pipeline on full raw dataset (for deployment)...")
    # Refit on the full dataset so the saved artifact uses every available labeled example
    final_pipeline.fit(df, y)

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    # Save the deployable pipeline and feature list alongside the notebook outputs
    joblib.dump(final_pipeline, FINAL_PIPELINE_PATH)
    joblib.dump(feature_cols, FEATURE_COLS_PATH)
    print("Saved pipeline to", FINAL_PIPELINE_PATH)
    print("Saved feature columns to", FEATURE_COLS_PATH)

    # Quick smoke test to confirm the exported artifact can make predictions on raw input rows
    pipe = joblib.load(FINAL_PIPELINE_PATH)
    raw_row = df.iloc[[0]].copy()
    prediction = pipe.predict(raw_row)
    probability = pipe.predict_proba(raw_row)[:, 1]
    print("\nArtifact inference test")
    print("Prediction:", prediction.tolist())
    print("Probability:", probability.tolist())

if __name__ == "__main__":
    main()