import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="House Price Prediction API")

# Enable CORS for local development or multi-origin setups
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve path relative to this script directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "House_price_model.pkl")

# Load pickled model
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model file at {MODEL_PATH}: {e}")

class HouseInput(BaseModel):
    area: float
    bedrooms: int
    bathrooms: float
    guestroom: int
    basement: int
    hotwaterheating: int
    airconditioning: int
    parking: int
    prefarea: int
    furnishingstatus_semi_furnished: int = Field(..., alias="furnishingstatus_semi-furnished")
    furnishingstatus_unfurnished: int = Field(..., alias="furnishingstatus_unfurnished")

    class Config:
        populate_by_name = True

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

FEATURE_COLUMNS = [
    "area",
    "bedrooms",
    "bathrooms",
    "guestroom",
    "basement",
    "hotwaterheating",
    "airconditioning",
    "parking",
    "prefarea",
    "furnishingstatus_semi-furnished",
    "furnishingstatus_unfurnished"
]

@app.post("/predict")
def predict_price(data: HouseInput):
    try:
        data_dict = {
            "area": [data.area],
            "bedrooms": [data.bedrooms],
            "bathrooms": [data.bathrooms],
            "guestroom": [data.guestroom],
            "basement": [data.basement],
            "hotwaterheating": [data.hotwaterheating],
            "airconditioning": [data.airconditioning],
            "parking": [data.parking],
            "prefarea": [data.prefarea],
            "furnishingstatus_semi-furnished": [data.furnishingstatus_semi_furnished],
            "furnishingstatus_unfurnished": [data.furnishingstatus_unfurnished],
        }
        df = pd.DataFrame(data_dict, columns=FEATURE_COLUMNS)

        prediction = model.predict(df)[0]
        return {"predicted_price": round(float(prediction), 2)}
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

# Serve React static build when available
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Don't intercept docs/openapi
        if full_path in ["docs", "openapi.json", "redoc"]:
            raise HTTPException(status_code=404, detail="Not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend build index.html not found"}