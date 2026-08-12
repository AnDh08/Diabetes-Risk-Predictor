from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.predict import router as predict_router

app = FastAPI(title="Diabetes Risk Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)

@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Diabetes Risk Predictor API"}

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}