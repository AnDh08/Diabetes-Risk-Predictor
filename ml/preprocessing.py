feature_cols = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth",
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education",
    "Income", "IsSenior", "PoorAct&PoorDiet"
]

def make_features(df_in):
    """Apply feature engineering required by the diabetes model."""
    df = df_in.copy()
    df["IsSenior"] = (df["Age"] >= 9).astype(float)
    df["PoorAct&PoorDiet"] = (
        (df["PhysActivity"] == 0)
        & ((df["Fruits"] == 0) | (df["Veggies"] == 0))
    ).astype(float)

    return df[feature_cols]