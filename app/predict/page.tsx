import { DashboardLayout } from "@/components/dashboard-layout"
import { PredictionForm } from "@/components/prediction-form"

export default function PredictPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Car Price Prediction</h1>
            <p className="text-muted-foreground text-balance">
              Get accurate price estimates using our advanced machine learning model
            </p>
          </div>

          <PredictionForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
