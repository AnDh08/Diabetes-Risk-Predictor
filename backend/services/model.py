from pathlib import Path

import joblib

class ModelService:
    """Service class for loading and using the machine learning model"""

    def __init__(self):
        self.model_path = (
            Path(__file__).resolve().parents[2]
            / "ml"
            / "artifacts"
            / "final_pipeline.joblib"
        )

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at {self.model_path}"
            )

        try:
            self.model = joblib.load(self.model_path)
        except FileNotFoundError as exc:
            raise RuntimeError(
                f"Model file not found at {self.model_path}"
            ) from exc
        except (OSError, EOFError, ValueError) as exc:
            raise RuntimeError(
                f"Model file at {self.model_path} is invalid or unreadable"
            ) from exc

    def predict(self, input_data):
        prediction = self.model.predict(input_data)[0]
        probability = self.model.predict_proba(input_data)[0][1]
        return int(prediction), float(probability)