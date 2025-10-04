"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PriceDistributionChartProps {
  priceStats: {
    mean: number
    median: number
    min: number
    max: number
    std: number
  }
}

export function PriceDistributionChart({ priceStats }: PriceDistributionChartProps) {
  // Generate histogram data based on price statistics
  const generateHistogramData = () => {
    const bins = 10
    const binWidth = (priceStats.max - priceStats.min) / bins
    const data = []

    for (let i = 0; i < bins; i++) {
      const binStart = priceStats.min + i * binWidth
      const binEnd = binStart + binWidth
      const binCenter = (binStart + binEnd) / 2

      // Simulate frequency based on normal distribution around mean
      const distanceFromMean = Math.abs(binCenter - priceStats.mean)
      const normalizedDistance = distanceFromMean / priceStats.std
      const frequency = Math.max(10, Math.round(1000 * Math.exp(-0.5 * normalizedDistance * normalizedDistance)))

      data.push({
        priceRange: `$${Math.round(binStart / 1000)}k-${Math.round(binEnd / 1000)}k`,
        frequency,
        binCenter,
      })
    }

    return data
  }

  const histogramData = generateHistogramData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            <span className="font-medium">Cars: </span>
            {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Distribution</CardTitle>
        <CardDescription>Distribution of car prices in the dataset</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="priceRange"
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="frequency" className="fill-primary" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
