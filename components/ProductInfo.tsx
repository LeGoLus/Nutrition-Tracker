import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductInfoProps {
  product: any;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedUnit, setSelectedUnit] = useState('100g');

  const getNutrientValue = (nutrient: string) => {
    const value = product.nutriments[`${nutrient}_${selectedUnit}`] || product.nutriments[nutrient];
    return value ? `${value} ${selectedUnit}` : 'N/A';
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{product.product_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setSelectedUnit} defaultValue={selectedUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100g">per 100g</SelectItem>
              <SelectItem value="serving">per serving</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>Energy: {getNutrientValue('energy-kcal')} kcal</div>
          <div>Protein: {getNutrientValue('proteins')}</div>
          <div>Carbohydrates: {getNutrientValue('carbohydrates')}</div>
          <div>Fat: {getNutrientValue('fat')}</div>
          <div>Fiber: {getNutrientValue('fiber')}</div>
          <div>Sugar: {getNutrientValue('sugars')}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfo;