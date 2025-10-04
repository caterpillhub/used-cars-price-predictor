import { DashboardLayout } from "@/components/dashboard-layout"
import { DatasetExplorer } from "@/components/dataset-explorer"

export default function DatasetPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Dataset Explorer</h1>
            <p className="text-muted-foreground text-balance">
              Browse and search through the used car dataset with advanced filtering
            </p>
          </div>

          <DatasetExplorer />
        </div>
      </div>
    </DashboardLayout>
  )
}
