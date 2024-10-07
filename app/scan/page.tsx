"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductInfo from '@/components/ProductInfo';

export default function ScanPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [productData, setProductData] = useState<any | null>(null);

  const handleBarcodeScanned = async (barcode: string) => {
    setScannedBarcode(barcode);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      if (data.status === 1) {
        setProductData(data.product);
      } else {
        setProductData(null);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setProductData(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scan Barcode</h1>
      <Card>
        <CardHeader>
          <CardTitle>Barcode Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          {!scannedBarcode ? (
            <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
          ) : (
            <div>
              <p className="mb-4">Scanned Barcode: {scannedBarcode}</p>
              <Button onClick={() => setScannedBarcode(null)}>Scan Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {productData && <ProductInfo product={productData} />}
    </div>
  );
}