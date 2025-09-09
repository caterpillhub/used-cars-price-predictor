"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, Target, Database, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getModelMetrics, getDatasetStats, type ModelMetrics, type DatasetStats } from "@/lib/api"
import { PriceDistributionChart } from "@/components/charts/price-distribution-chart"
import { BrandPriceChart } from "@/components/charts/brand-price-chart"
import { ModelMetricsCard } from "@/components/charts/model-metrics-card"

export function DashboardCharts() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, statsData] = await Promise.all([getModelMetrics(), getDatasetStats()])
        setMetrics(metricsData)
        setDatasetStats(statsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!metrics || !datasetStats) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Unable to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModelMetricsCard
          title="Model Accuracy"
          value={`${(metrics.r2_score * 100).toFixed(1)}%`}
          description="R² Score"
          icon={Target}
          trend="up"
        />
        <ModelMetricsCard
          title="Prediction Error"
          value={`$${Math.round(metrics.rmse).toLocaleString()}`}
          description="RMSE"
          icon={TrendingUp}
          trend="down"
        />
        <ModelMetricsCard
          title="Dataset Size"
          value={datasetStats.total_records.toLocaleString()}
          description="Training Records"
          icon={Database}
          trend="neutral"
        />
        <ModelMetricsCard
          title="Features"
          value={metrics.features_count.toString()}
          description="Input Variables"
          icon={BarChart3}
          trend="neutral"
        />
      </div>

      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Dataset Overview</CardTitle>
          <CardDescription>Key statistics from the used car dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                ${Math.round(datasetStats.price_stats.mean).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Average Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent">
                ${Math.round(datasetStats.price_stats.median).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Median Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-chart-1">
                ${Math.round(datasetStats.price_stats.min).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Min Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-chart-2">
                ${Math.round(datasetStats.price_stats.max).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Max Price</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-chart-3">
                {datasetStats.year_range.max - datasetStats.year_range.min + 1}
              </div>
              <div className="text-sm text-muted-foreground">Year Range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceDistributionChart priceStats={datasetStats.price_stats} />
        <BrandPriceChart brandDistribution={datasetStats.brand_distribution} />
      </div>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
          <CardDescription>Details about the machine learning model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Algorithm</span>
              <Badge variant="secondary">{metrics.model_type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Training Features</span>
              <Badge variant="outline">{metrics.features_count} variables</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Performance</span>
              <div className="flex gap-2">
                <Badge variant="secondary">R² = {metrics.r2_score.toFixed(4)}</Badge>
                <Badge variant="outline">RMSE = ${Math.round(metrics.rmse)}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
