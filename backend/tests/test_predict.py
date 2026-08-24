from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app, raise_server_exceptions=False)

valid_payload = {
    "HighBP": 1,
    "HighChol": 0,
    "CholCheck": 1,
    "BMI": 28.5,
    "Smoker": 0,
    "Stroke": 0,
    "HeartDiseaseorAttack": 0,
    "PhysActivity": 1,
    "Fruits": 1,
    "Veggies": 1,
    "HvyAlcoholConsump": 0,
    "AnyHealthcare": 1,
    "NoDocbcCost": 0,
    "GenHlth": 2,
    "MentHlth": 5,
    "PhysHlth": 3,
    "DiffWalk": 0,
    "Sex": 1,
    "Age": 6,
    "Education": 3,
    "Income": 4
}

def test_predict_valid_input():
    response = client.post("/predict", json=valid_payload)
    
    assert response.status_code == 200
    
    data = response.json()

    assert "prediction" in data
    assert data["prediction"] in [0, 1]
    assert "probability" in data
    assert 0.0 <= data["probability"] <= 1.0
    assert "risk_level" in data
    assert data["risk_level"] in ["low_risk", "high_risk"]

def test_predict_missing_field():
    payload = valid_payload.copy()
    payload.pop("Age")  # Remove a required field

    response = client.post("/predict", json=payload)

    assert response.status_code == 422
    assert any(error["loc"][-1] == "Age" for error in response.json()["detail"])

def test_predict_invalid_field_type():
    payload = valid_payload.copy()
    payload["BMI"] = "invalid_float"  # Set an invalid type for BMI

    response = client.post("/predict", json=payload)

    assert response.status_code == 422
    assert any(error["loc"][-1] == "BMI" for error in response.json()["detail"])

def test_predict_invalid_field_value():
    payload = valid_payload.copy()
    payload["HighBP"] = 2

    response = client.post("/predict", json=payload)

    assert response.status_code == 422
    assert any(error["loc"][-1] == "HighBP" for error in response.json()["detail"])

def test_predict_model_error(monkeypatch):
    def fail_prediction(request):
        raise RuntimeError("Model failed")

    monkeypatch.setattr(
        "backend.routes.predict.model_service.predict",
        fail_prediction,
    )

    response = client.post("/predict", json=valid_payload)

    assert response.status_code == 500
    assert response.json() == {
        "detail": "Prediction service is unavailable"
    }