"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          success: "bg-green-50 text-green-900 border-green-200",
          error: "bg-red-50 text-red-900 border-red-200",
          loading: "bg-blue-50 text-blue-900 border-blue-200",
          default: "bg-white text-gray-900 border-gray-200",
        },
      }}
    />
  )
}
