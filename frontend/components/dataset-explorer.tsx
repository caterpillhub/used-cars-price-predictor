"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Download, Filter, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getDatasetSample, getFeatureOptions, type FeatureOptions } from "@/lib/api"
import { DatasetTable } from "@/components/dataset-table"

interface CarRecord {
  brand: string
  model: string
  model_year: number
  mileage: number
  fuel_type: string
  transmission: string
  exterior_color: string
  interior_color: string
  accident_history: string
  clean_title: string
  horsepower: number
  engine_size: number
  price: number
}

interface FilterState {
  search: string
  brand: string
  minYear: string
  maxYear: string
  minPrice: string
  maxPrice: string
  fuelType: string
  transmission: string
}

export function DatasetExplorer() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CarRecord[]>([])
  const [featureOptions, setFeatureOptions] = useState<FeatureOptions | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [sortField, setSortField] = useState<keyof CarRecord>("price")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    fuelType: "",
    transmission: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [datasetData, optionsData] = await Promise.all([
          getDatasetSample(1000), // Load more data for exploration
          getFeatureOptions(),
        ])
        setData(datasetData.data)
        setFeatureOptions(optionsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dataset. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((record) => {
      const matchesSearch =
        !filters.search ||
        record.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.model.toLowerCase().includes(filters.search.toLowerCase())

      const matchesBrand = !filters.brand || record.brand === filters.brand
      const matchesMinYear = !filters.minYear || record.model_year >= Number.parseInt(filters.minYear)
      const matchesMaxYear = !filters.maxYear || record.model_year <= Number.parseInt(filters.maxYear)
      const matchesMinPrice = !filters.minPrice || record.price >= Number.parseInt(filters.minPrice)
      const matchesMaxPrice = !filters.maxPrice || record.price <= Number.parseInt(filters.maxPrice)
      const matchesFuelType = !filters.fuelType || record.fuel_type === filters.fuelType
      const matchesTransmission = !filters.transmission || record.transmission === filters.transmission

      return (
        matchesSearch &&
        matchesBrand &&
        matchesMinYear &&
        matchesMaxYear &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesFuelType &&
        matchesTransmission
      )
    })

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [data, filters, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      brand: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
      fuelType: "",
      transmission: "",
    })
    setCurrentPage(1)
  }

  const exportData = () => {
    const csvContent = [
      // Header
      Object.keys(filteredAndSortedData[0] || {}).join(","),
      // Data rows
      ...filteredAndSortedData.map((record) => Object.values(record).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `car-dataset-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: `Exported ${filteredAndSortedData.length} records to CSV file.`,
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!featureOptions) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Unable to load dataset</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
              <CardDescription>Filter and search through the car dataset</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} active</Badge>}
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by brand or model..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {featureOptions.brand?.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fuel Type</label>
              <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange("fuelType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All fuel types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All fuel types</SelectItem>
                  {featureOptions.fuel_type?.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transmission</label>
              <Select value={filters.transmission} onValueChange={(value) => handleFilterChange("transmission", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All transmissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All transmissions</SelectItem>
                  {featureOptions.transmission?.map((trans) => (
                    <SelectItem key={trans} value={trans}>
                      {trans}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year Range</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minYear}
                  onChange={(e) => handleFilterChange("minYear", e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxYear}
                  onChange={(e) => handleFilterChange("maxYear", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Price ($)</label>
              <Input
                placeholder="0"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Price ($)</label>
              <Input
                placeholder="100000"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedData.length} of {filteredAndSortedData.length} cars
          </p>
          {filteredAndSortedData.length !== data.length && (
            <Badge variant="outline">Filtered from {data.length} total</Badge>
          )}
        </div>
        <Button onClick={exportData} variant="outline" size="sm" disabled={filteredAndSortedData.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Data Table */}
      <DatasetTable
        data={paginatedData}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={(field, direction) => {
          setSortField(field)
          setSortDirection(direction)
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
