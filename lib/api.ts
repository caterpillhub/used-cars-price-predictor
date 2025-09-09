import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface CarFeatures {
  brand: string
  model: string
  model_year: number
  mileage: number
  fuel_type: string
  transmission: string
  exterior_color: string
  interior_color: string
  accident_history: string
  clean_title: string
  horsepower: number
  engine_size: number
}

export interface PredictionResponse {
  predicted_price: number
  confidence_interval: {
    lower: number
    upper: number
  }
  input_features: CarFeatures
}

export interface ModelMetrics {
  rmse: number
  r2_score: number
  model_type: string
  features_count: number
}

export interface DatasetStats {
  total_records: number
  price_stats: {
    mean: number
    median: number
    min: number
    max: number
    std: number
  }
  brand_distribution: Record<string, number>
  year_range: {
    min: number
    max: number
  }
}

export interface FeatureOptions {
  [key: string]: string[]
}

// API functions
export const predictPrice = async (carFeatures: CarFeatures): Promise<PredictionResponse> => {
  const response = await api.post("/predict", carFeatures)
  return response.data
}

export const getModelMetrics = async (): Promise<ModelMetrics> => {
  const response = await api.get("/metrics")
  return response.data
}

export const getDatasetStats = async (): Promise<DatasetStats> => {
  const response = await api.get("/dataset/stats")
  return response.data
}

export const getDatasetSample = async (limit = 100) => {
  const response = await api.get(`/dataset?limit=${limit}`)
  return response.data
}

export const getFeatureOptions = async (): Promise<FeatureOptions> => {
  const response = await api.get("/features")
  return response.data
}

export default api
