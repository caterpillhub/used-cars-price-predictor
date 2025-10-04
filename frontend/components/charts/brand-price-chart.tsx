"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BrandPriceChartProps {
  brandDistribution: Record<string, number>
}

export function BrandPriceChart({ brandDistribution }: BrandPriceChartProps) {
  // Convert brand distribution to chart data with simulated average prices
  const chartData = Object.entries(brandDistribution)
    .map(([brand, count]) => {
      // Simulate average prices based on brand premium
      const brandPremiums: Record<string, number> = {
        BMW: 35000,
        Mercedes: 38000,
        Audi: 33000,
        Toyota: 22000,
        Honda: 21000,
        Ford: 18000,
        Nissan: 19000,
        Hyundai: 17000,
        Kia: 16000,
        Mazda: 18000,
      }

      return {
        brand,
        count,
        avgPrice: brandPremiums[brand] || 20000,
      }
    })
    .sort((a, b) => b.avgPrice - a.avgPrice)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            <span className="font-medium">Avg Price: </span>${payload[0].value.toLocaleString()}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Cars: </span>
            {payload[0].payload.count}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Price by Brand</CardTitle>
        <CardDescription>Comparison of average prices across different car brands</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="brand"
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgPrice" className="fill-accent" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
