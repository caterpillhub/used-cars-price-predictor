import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Brain, TrendingUp, Database, Calculator, BarChart3, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Car className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-balance">Used Car Price Prediction System</h1>
              <p className="text-muted-foreground">AI-powered automotive analytics platform</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Leverage advanced machine learning algorithms to predict used car prices with high accuracy. Explore
            comprehensive analytics and make data-driven decisions in the automotive market.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/predict">
              <Button size="lg" className="gap-2">
                <Calculator className="h-4 w-4" />
                Start Predicting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Brain className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">ML-Powered Predictions</CardTitle>
              </div>
              <CardDescription>
                Advanced Random Forest algorithm trained on comprehensive automotive data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Random Forest</Badge>
                <Badge variant="outline">High Accuracy</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Real-time Analytics</CardTitle>
              </div>
              <CardDescription>
                Interactive charts and insights for market trends and price distributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Live Data</Badge>
                <Badge variant="outline">Interactive</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                  <Database className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Dataset Explorer</CardTitle>
              </div>
              <CardDescription>
                Browse and search through thousands of used car records with advanced filtering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">5000+ Records</Badge>
                <Badge variant="outline">Searchable</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              System Overview
            </CardTitle>
            <CardDescription>Key metrics and capabilities of the prediction system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Training Records</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-sm text-muted-foreground">Input Features</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-chart-1">95%+</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-chart-2">Real-time</div>
                <div className="text-sm text-muted-foreground">Predictions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </DashboardLayout>
  )
}
