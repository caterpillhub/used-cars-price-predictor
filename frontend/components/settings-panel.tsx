"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Palette, Database, Download, Bell, Globe, Save, RefreshCw, Monitor, Sun, Moon } from "lucide-react"

interface SettingsState {
  apiUrl: string
  autoRefresh: boolean
  refreshInterval: string
  exportFormat: string
  notifications: boolean
  compactView: boolean
  showTooltips: boolean
  language: string
}

export function SettingsPanel() {
  const { theme, setTheme, themes } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SettingsState>({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    autoRefresh: true,
    refreshInterval: "30",
    exportFormat: "csv",
    notifications: true,
    compactView: false,
    showTooltips: true,
    language: "en",
  })

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("app-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings((prev) => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  const handleSettingChange = (key: keyof SettingsState, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    try {
      localStorage.setItem("app-settings", JSON.stringify(settings))
      toast({
        title: "Settings Saved",
        description: "Your preferences have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetSettings = () => {
    const defaultSettings: SettingsState = {
      apiUrl: "http://localhost:8000",
      autoRefresh: true,
      refreshInterval: "30",
      exportFormat: "csv",
      notifications: true,
      compactView: false,
      showTooltips: true,
      language: "en",
    }
    setSettings(defaultSettings)
    localStorage.removeItem("app-settings")
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    })
  }

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
      default:
        return <Palette className="h-4 w-4" />
    }
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {["light", "dark", "system"].map((themeName) => (
                <Button
                  key={themeName}
                  variant={theme === themeName ? "default" : "outline"}
                  onClick={() => setTheme(themeName)}
                  className="justify-start gap-2"
                >
                  {getThemeIcon(themeName)}
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Choose your preferred theme. System will match your device settings.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Compact View</Label>
                <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
              </div>
              <Switch
                checked={settings.compactView}
                onCheckedChange={(checked) => handleSettingChange("compactView", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Tooltips</Label>
                <p className="text-xs text-muted-foreground">Display helpful tooltips</p>
              </div>
              <Switch
                checked={settings.showTooltips}
                onCheckedChange={(checked) => handleSettingChange("showTooltips", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & API
          </CardTitle>
          <CardDescription>Configure data fetching and API settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              value={settings.apiUrl}
              onChange={(e) => handleSettingChange("apiUrl", e.target.value)}
              placeholder="http://localhost:8000"
            />
            <p className="text-xs text-muted-foreground">
              The base URL for the prediction API. Change this if running the API on a different server.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Refresh</Label>
                <p className="text-xs text-muted-foreground">Automatically refresh data</p>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => handleSettingChange("autoRefresh", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Refresh Interval (seconds)</Label>
              <Select
                value={settings.refreshInterval}
                onValueChange={(value) => handleSettingChange("refreshInterval", value)}
                disabled={!settings.autoRefresh}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Download Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Downloads
          </CardTitle>
          <CardDescription>Configure export formats and download preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Export Format</Label>
              <Select
                value={settings.exportFormat}
                onValueChange={(value) => handleSettingChange("exportFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Show toast notifications for predictions, exports, and errors
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            System Information
          </CardTitle>
          <CardDescription>Application and system details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <Badge variant="outline">1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework:</span>
                <Badge variant="secondary">Next.js 15</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UI Library:</span>
                <Badge variant="secondary">shadcn/ui</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theme:</span>
                <Badge variant="outline">{theme}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Status:</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={saveSettings} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
        <Button onClick={resetSettings} variant="outline" className="flex-1 bg-transparent">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
