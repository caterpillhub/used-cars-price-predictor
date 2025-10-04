"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calculator, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Quick Actions Menu */}
        <div
          className={cn(
            "absolute bottom-16 right-0 space-y-2 transition-all duration-200",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          )}
        >
          <Link href="/predict">
            <Button size="sm" className="shadow-lg hover:shadow-xl transition-shadow">
              <Calculator className="h-4 w-4 mr-2" />
              Quick Predict
            </Button>
          </Link>
        </div>

        {/* Main FAB */}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}
