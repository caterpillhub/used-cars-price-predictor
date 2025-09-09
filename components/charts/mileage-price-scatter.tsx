"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MileagePriceScatterProps {
  data?: Array<{ mileage: number; price: number; brand: string }>
}

export function MileagePriceScatter({ data }: MileagePriceScatterProps) {
  // Generate sample scatter plot data if not provided
  const generateScatterData = () => {
    const sampleData = []
    const brands = ["Toyota", "Honda", "BMW", "Mercedes", "Ford", "Nissan"]

    for (let i = 0; i < 100; i++) {
      const mileage = Math.random() * 150000 + 10000
      const brand = brands[Math.floor(Math.random() * brands.length)]

      // Price decreases with mileage, with brand premium
      const brandPremium = brand === "BMW" || brand === "Mercedes" ? 15000 : 0
      const basePrice = 30000 + brandPremium
      const mileagePenalty = (mileage / 1000) * 50
      const randomVariation = (Math.random() - 0.5) * 10000

      const price = Math.max(5000, basePrice - mileagePenalty + randomVariation)

      sampleData.push({
        mileage: Math.round(mileage),
        price: Math.round(price),
        brand,
      })
    }

    return sampleData
  }

  const scatterData = data || generateScatterData()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.brand}</p>
          <p className="text-primary">
            <span className="font-medium">Price: </span>${data.price.toLocaleString()}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Mileage: </span>
            {data.mileage.toLocaleString()} mi
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mileage vs Price</CardTitle>
        <CardDescription>Relationship between car mileage and price</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              dataKey="mileage"
              name="Mileage"
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="number"
              dataKey="price"
              name="Price"
              className="text-xs fill-muted-foreground"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={scatterData} className="fill-chart-1" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
