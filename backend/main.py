from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI()

# Enable CORS for React communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your pickled model
try:
    model = joblib.load("House_price_model.pkl")
except Exception as e:
    raise RuntimeError(f"Failed to load model file: {e}")

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

@app.post("/predict")
def predict_price(data: HouseInput):
    try:
        # Array must strictly match model's expected 11 feature names in order
        features = np.array([[
            data.area,
            data.bedrooms,
            data.bathrooms,
            data.guestroom,
            data.basement,
            data.hotwaterheating,
            data.airconditioning,
            data.parking,
            data.prefarea,
            data.furnishingstatus_semi_furnished,
            data.furnishingstatus_unfurnished
        ]])

        prediction = model.predict(features)[0]
        return {"predicted_price": round(float(prediction), 2)}
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))