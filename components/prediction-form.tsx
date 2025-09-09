"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calculator, Car } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  predictPrice,
  getFeatureOptions,
  type CarFeatures,
  type PredictionResponse,
  type FeatureOptions,
} from "@/lib/api"
import { PredictionResult } from "./prediction-result"

export function PredictionForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [featureOptions, setFeatureOptions] = useState<FeatureOptions | null>(null)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [formData, setFormData] = useState<CarFeatures>({
    brand: "",
    model: "",
    model_year: new Date().getFullYear(),
    mileage: 50000,
    fuel_type: "",
    transmission: "",
    exterior_color: "",
    interior_color: "",
    accident_history: "",
    clean_title: "",
    horsepower: 200,
    engine_size: 2.0,
  })

  useEffect(() => {
    const loadFeatureOptions = async () => {
      try {
        const options = await getFeatureOptions()
        setFeatureOptions(options)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form options. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadFeatureOptions()
  }, [toast])

  const handleInputChange = (field: keyof CarFeatures, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = [
      "brand",
      "model",
      "fuel_type",
      "transmission",
      "exterior_color",
      "interior_color",
      "accident_history",
      "clean_title",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof CarFeatures])

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await predictPrice(formData)
      setPrediction(result)
      toast({
        title: "Prediction Complete",
        description: `Estimated price: $${result.predicted_price.toLocaleString()}`,
      })
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Unable to get price prediction. Please check your inputs and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!featureOptions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Car Details
          </CardTitle>
          <CardDescription>Enter the car specifications to get an accurate price prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.brand?.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.model?.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model_year">Model Year</Label>
                <Input
                  id="model_year"
                  type="number"
                  min="2010"
                  max="2024"
                  value={formData.model_year}
                  onChange={(e) => handleInputChange("model_year", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  max="500000"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", Number.parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type *</Label>
                <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange("fuel_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.fuel_type?.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission *</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => handleInputChange("transmission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.transmission?.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horsepower">Horsepower</Label>
                <Input
                  id="horsepower"
                  type="number"
                  min="100"
                  max="800"
                  value={formData.horsepower}
                  onChange={(e) => handleInputChange("horsepower", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engine_size">Engine Size (L)</Label>
                <Input
                  id="engine_size"
                  type="number"
                  min="1.0"
                  max="8.0"
                  step="0.1"
                  value={formData.engine_size}
                  onChange={(e) => handleInputChange("engine_size", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Appearance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exterior_color">Exterior Color *</Label>
                <Select
                  value={formData.exterior_color}
                  onValueChange={(value) => handleInputChange("exterior_color", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exterior color" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.exterior_color?.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interior_color">Interior Color *</Label>
                <Select
                  value={formData.interior_color}
                  onValueChange={(value) => handleInputChange("interior_color", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interior color" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.interior_color?.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accident_history">Accident History *</Label>
                <Select
                  value={formData.accident_history}
                  onValueChange={(value) => handleInputChange("accident_history", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select accident history" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.accident_history?.map((history) => (
                      <SelectItem key={history} value={history}>
                        {history}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clean_title">Clean Title *</Label>
                <Select value={formData.clean_title} onValueChange={(value) => handleInputChange("clean_title", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title status" />
                  </SelectTrigger>
                  <SelectContent>
                    {featureOptions.clean_title?.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting Price...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Predict Price
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {prediction && <PredictionResult prediction={prediction} />}
    </div>
  )
}
