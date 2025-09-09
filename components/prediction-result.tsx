"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Download, Share } from "lucide-react"
import type { PredictionResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface PredictionResultProps {
  prediction: PredictionResponse
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const confidenceRange = prediction.confidence_interval.upper - prediction.confidence_interval.lower
  const confidencePercentage = ((confidenceRange / prediction.predicted_price) * 100).toFixed(1)

  const handleExport = () => {
    const data = {
      prediction: prediction.predicted_price,
      confidence_interval: prediction.confidence_interval,
      input_features: prediction.input_features,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `car-price-prediction-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Prediction data has been downloaded as JSON file.",
    })
  }

  const handleShare = async () => {
    const shareText = `Car Price Prediction: ${formatPrice(prediction.predicted_price)} for ${prediction.input_features.model_year} ${prediction.input_features.brand} ${prediction.input_features.model}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Car Price Prediction",
          text: shareText,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to Clipboard",
          description: "Prediction details copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "Copied to Clipboard",
        description: "Prediction details copied to clipboard.",
      })
    }
  }

  return (
    <Card className="animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Price Prediction Result
        </CardTitle>
        <CardDescription>AI-powered prediction based on your car specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Prediction */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-primary">{formatPrice(prediction.predicted_price)}</div>
          <p className="text-muted-foreground">
            Estimated market value for your {prediction.input_features.model_year} {prediction.input_features.brand}{" "}
            {prediction.input_features.model}
          </p>
        </div>

        {/* Confidence Interval */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Confidence Range</span>
            <Badge variant="secondary">±{confidencePercentage}%</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Lower Bound</div>
                <div className="font-semibold">{formatPrice(prediction.confidence_interval.lower)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <div>
                <div className="text-sm text-muted-foreground">Upper Bound</div>
                <div className="font-semibold">{formatPrice(prediction.confidence_interval.upper)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Car Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Year</div>
            <div className="font-medium">{prediction.input_features.model_year}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Mileage</div>
            <div className="font-medium">{prediction.input_features.mileage.toLocaleString()} mi</div>
          </div>
          <div>
            <div className="text-muted-foreground">Fuel Type</div>
            <div className="font-medium">{prediction.input_features.fuel_type}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Transmission</div>
            <div className="font-medium">{prediction.input_features.transmission}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleExport} variant="outline" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
