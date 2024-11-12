// src/services/rentalAnalysis.ts

import { Property } from "@/lib/types/database";

export const analyzeRentalData = (properties: Property[]) => {
  // Group properties by type and state for analysis
  const groupByType = properties.reduce((acc, property) => {
    acc[property.type] = acc[property.type] || [];
    acc[property.type].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  const groupByState = properties.reduce((acc, property) => {
    if (property.state) {
      acc[property.state] = acc[property.state] || [];
      acc[property.state].push(property);
    }
    return acc;
  }, {} as Record<string, Property[]>);

  // Calculate price per bed and price per size metrics
  const pricePerMetrics = properties.map(p => ({
    id: p.id,
    pricePerBed: p.beds ? p.price / p.beds : null,
    pricePerSqft: p.size ? p.price / p.size : null,
    type: p.type,
    state: p.state,
    beds: p.beds,
    size: p.size
  }));

  // Calculate averages by property type
  const typeAnalysis = Object.entries(groupByType).map(([type, props]) => {
    const prices = props.map(p => p.price);
    const pricePerBedValues = props
      .filter(p => p.beds && p.beds > 0)
      .map(p => p.price / p.beds);
    const pricePerSqftValues = props
      .filter(p => p.size && p.size > 0)
      .map(p => p.price / p.size);

    return {
      type,
      count: props.length,
      medianPrice: calculateMedian(prices),
      averagePrice: calculateMean(prices),
      averagePricePerBed: pricePerBedValues.length ? calculateMean(pricePerBedValues) : null,
      averagePricePerSqft: pricePerSqftValues.length ? calculateMean(pricePerSqftValues) : null
    };
  });

  // Calculate state-level metrics
  const stateAnalysis = Object.entries(groupByState).map(([state, props]) => {
    const prices = props.map(p => p.price);
    const pricePerBedValues = props
      .filter(p => p.beds && p.beds > 0)
      .map(p => p.price / p.beds);
    const pricePerSqftValues = props
      .filter(p => p.size && p.size > 0)
      .map(p => p.price / p.size);

    return {
      state,
      count: props.length,
      medianPrice: calculateMedian(prices),
      averagePrice: calculateMean(prices),
      averagePricePerBed: pricePerBedValues.length ? calculateMean(pricePerBedValues) : null,
      averagePricePerSqft: pricePerSqftValues.length ? calculateMean(pricePerSqftValues) : null
    };
  }).sort((a, b) => b.count - a.count);


  return {
    typeAnalysis,
    stateAnalysis,
    totalListings: properties.length,
    averagePricePerBed: calculateMean(pricePerMetrics
      .filter(p => p.pricePerBed !== null)
      .map(p => p.pricePerBed!)),
    averagePricePerSqft: calculateMean(pricePerMetrics
      .filter(p => p.pricePerSqft !== null)
      .map(p => p.pricePerSqft!))
  };
};

// Helper functions
const calculateMedian = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

const calculateMean = (numbers: number[]): number => 
  numbers.length > 0 ? numbers.reduce((acc, val) => acc + val, 0) / numbers.length : 0;