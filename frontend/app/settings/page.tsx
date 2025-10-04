import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsPanel } from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Settings</h1>
            <p className="text-muted-foreground text-balance">Configure your preferences and application settings</p>
          </div>

          <SettingsPanel />
        </div>
      </div>
    </DashboardLayout>
  )
}
