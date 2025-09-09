# 🚗 Used Cars Price Predictor

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react\&logoColor=white)](https://react.dev/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5+-f7931e?logo=scikitlearn\&logoColor=white)](https://scikit-learn.org/stable/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1+-00a5ff?logo=xgboost\&logoColor=white)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📌 Overview

The **Used Cars Price Predictor** is a full-stack ML-powered web application that helps users estimate the **fair market price of a used car** based on its features.

The project combines:

* 🧠 **Machine Learning** models (Linear, Ridge, Lasso, Random Forest, Gradient Boosting, XGBoost)
* ⚡ **FastAPI backend** for predictions
* 🎨 **React frontend** with dashboard, menu bar & interactive UI
* 📊 **Data preprocessing & cleaning pipeline** to ensure accurate predictions

👉 Live demo (coming soon)

---

## ✨ Features

✅ Upload or input car details (brand, model, year, mileage, fuel type, etc.)
✅ Predict **market price** with confidence intervals
✅ Interactive **dashboard & visual analytics**
✅ Multiple ML models with comparison metrics (RMSE, R²)
✅ RESTful API with **FastAPI**
✅ Modern **React frontend** with responsive design
✅ Model persistence with `joblib` and JSON metadata
✅ Scalable structure for deployment (Docker-ready)

---

## 🛠️ Tech Stack

### 🔹 Backend

* [Python 3.12+](https://www.python.org/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [Scikit-learn](https://scikit-learn.org/stable/)
* [XGBoost](https://xgboost.readthedocs.io/)
* [Pandas & NumPy](https://pandas.pydata.org/)
* [Joblib](https://joblib.readthedocs.io/)

### 🔹 Frontend

* [React 19](https://react.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [ShadCN UI](https://ui.shadcn.com/)
* [Recharts](https://recharts.org/) for charts & analytics

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/caterpillhub/used-cars-price-predictor.git
cd used-cars-price-predictor
```

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will start at 👉 `http://127.0.0.1:8000`

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

Frontend will start at 👉 `http://localhost:3000`

---

## 📊 Dataset

We used the **Used Car Price Prediction Dataset** from Kaggle with **4,000+ records**.
Features include:

* `brand`
* `model`
* `model_year`
* `mileage`
* `fuel_type`
* `engine`
* `transmission`
* `color`
* `accident_history`
* `title_status`
* `price` (target)

---

## 📈 Model Training

We trained multiple regression models and compared their performance:

| Model             | RMSE   | R² Score |
| ----------------- | ------ | -------- |
| Linear Regression | \~xxxx | \~0.xx   |
| Ridge Regression  | \~xxxx | \~0.xx   |
| Lasso Regression  | \~xxxx | \~0.xx   |
| Random Forest     | \~xxxx | \~0.xx   |
| Gradient Boosting | \~xxxx | \~0.xx   |
| XGBoost           | \~xxxx | \~0.xx   |

> 🔑 Final deployment uses **XGBoost + Random Forest** for best accuracy.

---

## 📸 Screenshots



---

## 📌 API Endpoints

### `POST /predict`

Predict car price from input JSON.

**Request:**

```json
{
  "brand": "Ford",
  "model": "F-150",
  "model_year": 2018,
  "mileage": 40000,
  "fuel_type": "Gasoline",
  "engine": "3.5L V6",
  "transmission": "Automatic",
  "ext_col": "Black",
  "int_col": "Gray",
  "accident": "None reported",
  "clean_title": "Yes"
}
```

**Response:**

```json
{
  "predicted_price": 22000,
  "confidence_interval": {
    "lower": 19800,
    "upper": 24200
  },
  "input_features": {...}
}
```

---

## 📦 Deployment

* Dockerfile & CI/CD pipeline support (coming soon)
* Can be deployed on **Render, Railway, AWS, Azure, GCP**

---

## 🤝 Contributing

Pull requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push (`git push origin feature/awesome-feature`)
5. Open a PR

---

## 📜 License

This project is licensed under the MIT License.

---

## 🌟 Acknowledgements

* [Kaggle - Used Car Dataset](https://www.kaggle.com/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [React](https://react.dev/)
* [Scikit-learn](https://scikit-learn.org/)
