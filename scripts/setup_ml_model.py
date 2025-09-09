import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json

# Generate sample used car dataset
def generate_sample_dataset():
    np.random.seed(42)
    
    brands = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Kia', 'Mazda']
    models = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup']
    fuel_types = ['Gasoline', 'Diesel', 'Hybrid', 'Electric']
    transmissions = ['Manual', 'Automatic', 'CVT']
    colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Green']
    accident_history = ['None', 'Minor', 'Major']
    clean_title = ['Yes', 'No']
    
    n_samples = 5000
    
    data = {
        'brand': np.random.choice(brands, n_samples),
        'model': np.random.choice(models, n_samples),
        'model_year': np.random.randint(2010, 2024, n_samples),
        'mileage': np.random.randint(5000, 200000, n_samples),
        'fuel_type': np.random.choice(fuel_types, n_samples),
        'transmission': np.random.choice(transmissions, n_samples),
        'exterior_color': np.random.choice(colors, n_samples),
        'interior_color': np.random.choice(colors, n_samples),
        'accident_history': np.random.choice(accident_history, n_samples),
        'clean_title': np.random.choice(clean_title, n_samples),
        'horsepower': np.random.randint(120, 500, n_samples),
        'engine_size': np.round(np.random.uniform(1.0, 6.0, n_samples), 1)
    }
    
    df = pd.DataFrame(data)
    
    # Generate realistic prices based on features
    base_price = 15000
    year_factor = (df['model_year'] - 2010) * 1000
    mileage_factor = -df['mileage'] * 0.05
    brand_premium = df['brand'].map({
        'BMW': 8000, 'Mercedes': 9000, 'Audi': 7000,
        'Toyota': 2000, 'Honda': 1500, 'Ford': 0,
        'Nissan': 500, 'Hyundai': -500, 'Kia': -1000, 'Mazda': 0
    })
    horsepower_factor = df['horsepower'] * 20
    accident_penalty = df['accident_history'].map({'None': 0, 'Minor': -2000, 'Major': -5000})
    title_penalty = df['clean_title'].map({'Yes': 0, 'No': -3000})
    
    df['price'] = (base_price + year_factor + mileage_factor + brand_premium + 
                   horsepower_factor + accident_penalty + title_penalty + 
                   np.random.normal(0, 2000, n_samples)).clip(5000, 80000)
    
    return df

# Train and save the model
def train_model():
    print("Generating sample dataset...")
    df = generate_sample_dataset()
    
    # Save dataset
    df.to_csv('used_cars_dataset.csv', index=False)
    print(f"Dataset saved with {len(df)} samples")
    
    # Prepare features
    categorical_features = ['brand', 'model', 'fuel_type', 'transmission', 
                           'exterior_color', 'interior_color', 'accident_history', 'clean_title']
    numerical_features = ['model_year', 'mileage', 'horsepower', 'engine_size']
    
    # Encode categorical variables
    label_encoders = {}
    df_encoded = df.copy()
    
    for feature in categorical_features:
        le = LabelEncoder()
        df_encoded[feature] = le.fit_transform(df[feature])
        label_encoders[feature] = le
    
    # Prepare X and y
    X = df_encoded[categorical_features + numerical_features]
    y = df_encoded['price']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale numerical features
    scaler = StandardScaler()
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    X_train_scaled[numerical_features] = scaler.fit_transform(X_train[numerical_features])
    X_test_scaled[numerical_features] = scaler.transform(X_test[numerical_features])
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance:")
    print(f"RMSE: ${rmse:.2f}")
    print(f"R² Score: {r2:.4f}")
    
    # Save model and preprocessing objects
    joblib.dump(model, 'best_used_car_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(label_encoders, 'label_encoders.pkl')
    
    # Save feature names and model metrics
    model_info = {
        'categorical_features': categorical_features,
        'numerical_features': numerical_features,
        'feature_order': categorical_features + numerical_features,
        'rmse': float(rmse),
        'r2_score': float(r2),
        'unique_values': {feature: df[feature].unique().tolist() for feature in categorical_features}
    }
    
    with open('model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print("Model and preprocessing objects saved successfully!")
    return model_info

if __name__ == "__main__":
    model_info = train_model()
