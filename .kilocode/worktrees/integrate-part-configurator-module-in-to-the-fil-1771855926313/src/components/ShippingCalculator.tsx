import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import api from '../api/api';

interface ShippingRate {
  carrier: string;
  service: string;
  cost: number;
  estimatedDays: number;
}

interface ShippingCalculatorProps {
  orderId: string;
  onRateSelected: (rate: ShippingRate) => void;
}

export function ShippingCalculator({ orderId, onRateSelected }: ShippingCalculatorProps) {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateRates();
  }, [orderId]);

  const calculateRates = async () => {
    setLoading(true);
    try {
      const response = await api.post('/orders/shipping-rates', { orderId });
      setRates(response.data.rates);
    } catch (error) {
      console.error('Failed to calculate shipping rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateSelect = (rate: ShippingRate) => {
    onRateSelected(rate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Options</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Calculating shipping rates...</div>
        ) : (
          <div className="space-y-2">
            {rates.map((rate, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{rate.carrier} - {rate.service}</div>
                  <div className="text-sm text-gray-600">
                    Estimated delivery: {rate.estimatedDays} business days
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${rate.cost.toFixed(2)}</div>
                  <Button
                    size="sm"
                    onClick={() => handleRateSelect(rate)}
                    className="mt-1"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}