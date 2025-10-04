from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import joblib
import pandas as pd
import numpy as np
import json
import os

app = FastAPI(title="Used Car Price Prediction API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and preprocessing objects
try:
    model = joblib.load('best_used_car_model.pkl')
    scaler = joblib.load('scaler.pkl')
    label_encoders = joblib.load('label_encoders.pkl')
    
    with open('model_info.json', 'r') as f:
        model_info = json.load(f)
    
    # Load dataset for exploration
    dataset = pd.read_csv('used_cars_dataset.csv')
    
    print("Model and data loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    model_info = None
    dataset = None

class CarFeatures(BaseModel):
    brand: str
    model: str
    model_year: int
    mileage: int
    fuel_type: str
    transmission: str
    exterior_color: str
    interior_color: str
    accident_history: str
    clean_title: str
    horsepower: int
    engine_size: float

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_interval: Dict[str, float]
    input_features: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "Used Car Price Prediction API", "status": "running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(car: CarFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert input to DataFrame
        input_data = pd.DataFrame([car.dict()])
        
        # Encode categorical features
        for feature in model_info['categorical_features']:
            if feature in label_encoders:
                try:
                    input_data[feature] = label_encoders[feature].transform(input_data[feature])
                except ValueError:
                    # Handle unseen categories
                    input_data[feature] = 0
        
        # Scale numerical features
        input_scaled = input_data.copy()
        input_scaled[model_info['numerical_features']] = scaler.transform(
            input_data[model_info['numerical_features']]
        )
        
        # Reorder columns to match training data
        input_scaled = input_scaled[model_info['feature_order']]
        
        # Make prediction
        prediction = model.predict(input_scaled)[0]
        
        # Calculate confidence interval (approximate)
        std_error = prediction * 0.1  # 10% standard error approximation
        confidence_interval = {
            "lower": max(0, prediction - 1.96 * std_error),
            "upper": prediction + 1.96 * std_error
        }
        
        return PredictionResponse(
            predicted_price=round(prediction, 2),
            confidence_interval=confidence_interval,
            input_features=car.dict()
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/metrics")
async def get_model_metrics():
    if model_info is None:
        raise HTTPException(status_code=500, detail="Model info not available")
    
    return {
        "rmse": model_info['rmse'],
        "r2_score": model_info['r2_score'],
        "model_type": "Random Forest Regressor",
        "features_count": len(model_info['feature_order'])
    }

@app.get("/dataset")
async def get_dataset_sample(limit: int = 100):
    if dataset is None:
        raise HTTPException(status_code=500, detail="Dataset not available")
    
    sample_data = dataset.head(limit).to_dict('records')
    return {
        "data": sample_data,
        "total_records": len(dataset),
        "sample_size": len(sample_data)
    }

@app.get("/dataset/stats")
async def get_dataset_stats():
    if dataset is None:
        raise HTTPException(status_code=500, detail="Dataset not available")
    
    stats = {
        "total_records": len(dataset),
        "price_stats": {
            "mean": float(dataset['price'].mean()),
            "median": float(dataset['price'].median()),
            "min": float(dataset['price'].min()),
            "max": float(dataset['price'].max()),
            "std": float(dataset['price'].std())
        },
        "brand_distribution": dataset['brand'].value_counts().to_dict(),
        "year_range": {
            "min": int(dataset['model_year'].min()),
            "max": int(dataset['model_year'].max())
        }
    }
    
    return stats

@app.get("/features")
async def get_feature_options():
    if model_info is None:
        raise HTTPException(status_code=500, detail="Model info not available")
    
    return model_info['unique_values']

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
