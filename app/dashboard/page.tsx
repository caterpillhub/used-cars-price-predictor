import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCharts } from "@/components/dashboard-charts"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-balance">Model performance metrics and data insights</p>
          </div>

          <DashboardCharts />
        </div>
      </div>
    </DashboardLayout>
  )
}
