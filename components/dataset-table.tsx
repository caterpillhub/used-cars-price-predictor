"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

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

interface DatasetTableProps {
  data: CarRecord[]
  sortField: keyof CarRecord
  sortDirection: "asc" | "desc"
  onSort: (field: keyof CarRecord, direction: "asc" | "desc") => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DatasetTable({
  data,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: DatasetTableProps) {
  const handleSort = (field: keyof CarRecord) => {
    if (sortField === field) {
      onSort(field, sortDirection === "asc" ? "desc" : "asc")
    } else {
      onSort(field, "desc")
    }
  }

  const SortIcon = ({ field }: { field: keyof CarRecord }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getAccidentBadgeVariant = (history: string) => {
    switch (history) {
      case "None":
        return "default"
      case "Minor":
        return "secondary"
      case "Major":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("brand")} className="h-auto p-0 font-medium">
                  Brand
                  <SortIcon field="brand" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("model")} className="h-auto p-0 font-medium">
                  Model
                  <SortIcon field="model" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("model_year")} className="h-auto p-0 font-medium">
                  Year
                  <SortIcon field="model_year" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("mileage")} className="h-auto p-0 font-medium">
                  Mileage
                  <SortIcon field="mileage" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("fuel_type")} className="h-auto p-0 font-medium">
                  Fuel
                  <SortIcon field="fuel_type" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("transmission")} className="h-auto p-0 font-medium">
                  Trans
                  <SortIcon field="transmission" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("horsepower")} className="h-auto p-0 font-medium">
                  HP
                  <SortIcon field="horsepower" />
                </Button>
              </TableHead>
              <TableHead>Accident</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("price")} className="h-auto p-0 font-medium">
                  Price
                  <SortIcon field="price" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{record.brand}</TableCell>
                <TableCell>{record.model}</TableCell>
                <TableCell>{record.model_year}</TableCell>
                <TableCell>{record.mileage.toLocaleString()} mi</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {record.fuel_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {record.transmission}
                  </Badge>
                </TableCell>
                <TableCell>{record.horsepower}</TableCell>
                <TableCell>
                  <Badge variant={getAccidentBadgeVariant(record.accident_history)} className="text-xs">
                    {record.accident_history}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={record.clean_title === "Yes" ? "default" : "destructive"} className="text-xs">
                    {record.clean_title}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">{formatPrice(record.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
