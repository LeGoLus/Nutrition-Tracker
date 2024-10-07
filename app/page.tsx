'use client'

import { useState } from 'react'
import BarcodeScanner from '@/components/BarcodeScanner'
import ProductDisplay from '@/components/ProductDisplay'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Home() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)

  const handleBarcodeScanned = (barcode: string) => {
    setScannedBarcode(barcode)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Nutrition Tracker</h1>
      <ErrorBoundary>
        <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
        <ProductDisplay barcode={scannedBarcode} />
      </ErrorBoundary>
    </main>
  )
}