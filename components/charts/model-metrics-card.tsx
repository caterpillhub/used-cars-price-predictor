import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface ModelMetricsCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend: "up" | "down" | "neutral"
}

export function ModelMetricsCard({ title, value, description, icon: Icon, trend }: ModelMetricsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-accent" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-destructive" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-accent"
      case "down":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {getTrendIcon()}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
