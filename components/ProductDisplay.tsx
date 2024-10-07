'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'

interface Product {
  product_name: string
  image_front_url: string
  nutriments: {
    [key: string]: number
  }
  serving_size: string
  nutrition_data_per: string
}

interface ProductDisplayProps {
  barcode: string | null
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ barcode }) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<'100g' | 'serving'>('serving')

  useEffect(() => {
    const fetchProduct = async () => {
      if (!barcode) return

      setProduct(null)
      setError(null)

      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
        const data = await response.json()
        if (data.status === 1) {
          setProduct(data.product)
          setUnit(data.product.nutrition_data_per === 'serving' ? 'serving' : '100g')
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to fetch product data')
      }
    }

    fetchProduct()
  }, [barcode])

  if (!barcode) {
    return <div className="text-center">Please scan a barcode to view product information.</div>
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <AlertCircle className="inline-block ml-2" />
      </div>
    )
  }

  if (!product) {
    return <div className="text-center">Loading...</div>
  }

  const getNutrientValue = (nutrient: string) => {
    const value = unit === 'serving' ? product.nutriments[`${nutrient}_serving`] : product.nutriments[nutrient]
    return value ? `${value.toFixed(2)} ${unit === '100g' ? 'g' : ''}` : 'N/A'
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">{product.product_name}</h2>
      {product.image_front_url && (
        <div className="mb-4 flex justify-center">
          <Image src={product.image_front_url} alt={product.product_name} width={200} height={200} />
        </div>
      )}
      <div className="mb-4">
        <Select onValueChange={(value) => setUnit(value as '100g' | 'serving')} value={unit}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100g">per 100g</SelectItem>
            <SelectItem value="serving">per serving</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {unit === 'serving' && product.serving_size && (
        <p className="mb-4">Serving size: {product.serving_size}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Energy</h3>
          <p>{getNutrientValue('energy-kcal')} kcal</p>
        </div>
        <div>
          <h3 className="font-semibold">Proteins</h3>
          <p>{getNutrientValue('proteins')}</p>
        </div>
        <div>
          <h3 className="font-semibold">Carbohydrates</h3>
          <p>{getNutrientValue('carbohydrates')}</p>
        </div>
        <div>
          <h3 className="font-semibold">Fat</h3>
          <p>{getNutrientValue('fat')}</p>
        </div>
        <div>
          <h3 className="font-semibold">Fiber</h3>
          <p>{getNutrientValue('fiber')}</p>
        </div>
        <div>
          <h3 className="font-semibold">Sugar</h3>
          <p>{getNutrientValue('sugars')}</p>
        </div>
        <div>
          <h3 className="font-semibold">Saturated Fat</h3>
          <p>{getNutrientValue('saturated-fat')}</p>
        </div>
        <div>
          <h3 className="font-semibold">Salt</h3>
          <p>{getNutrientValue('salt')}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay