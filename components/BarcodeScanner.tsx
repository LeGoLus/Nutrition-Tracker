'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Barcode, Camera, Upload } from 'lucide-react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import jsQR from 'jsqr'

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeScanned }) => {
  const [barcode, setBarcode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const onScanSuccess = useCallback((decodedText: string) => {
    onBarcodeScanned(decodedText)
    stopScanning()
  }, [onBarcodeScanned])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcode) {
      onBarcodeScanned(barcode)
      setBarcode('')
    }
  }

  const startScanning = () => {
    setIsScanning(true)
  }

  useEffect(() => {
    if (isScanning) {
      const readerElement = document.getElementById('reader')
      if (readerElement) {
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        )
        scannerRef.current.render(onScanSuccess, onScanFailure)
      }
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [isScanning, onScanSuccess])

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      setIsScanning(false)
    }
  }

  const onScanFailure = (error: any) => {
    console.warn(`Code scan error = ${error}`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height)
            if (code) {
              onBarcodeScanned(code.data)
            } else {
              alert('No QR code found in the image')
            }
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="mb-8 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center mb-4">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter barcode"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <Button type="submit" className="ml-2">
          <Barcode className="h-6 w-6" />
        </Button>
      </form>
      <div className="flex justify-between mb-4">
        <Button onClick={isScanning ? stopScanning : startScanning}>
          <Camera className="h-6 w-6 mr-2" />
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>
        <Button onClick={() => document.getElementById('file-upload')?.click()}>
          <Upload className="h-6 w-6 mr-2" />
          Upload Image
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <div id="reader" className={`w-full ${isScanning ? '' : 'hidden'}`}></div>
    </div>
  )
}

export default BarcodeScanner