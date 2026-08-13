from pathlib import Path

import joblib
import pandas as pd

from backend.schemas.prediction import PredictionRequest

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

        self.input_columns = list(PredictionRequest.model_fields.keys())

    def _to_input_frame(self, input_data: PredictionRequest) -> pd.DataFrame:
        if hasattr(input_data, "model_dump"):
            payload = input_data.model_dump()
        elif isinstance(input_data, dict):
            payload = input_data
        else:
            payload = dict(input_data)

        return pd.DataFrame(
            [[payload[column] for column in self.input_columns]],
            columns=self.input_columns,
        )

    def predict(self, input_data: PredictionRequest) -> tuple[int, float]:
        model_input = self._to_input_frame(input_data)
        prediction = self.model.predict(model_input)[0]
        probability = self.model.predict_proba(model_input)[0][1]
        return int(prediction), float(probability)