// src/services/rentalAnalysis.ts

import { Property } from "@/libs/types/database";

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

  // Calculate metrics for each property type
  const typeAnalysis = Object.entries(groupByType).map(([type, props]) => {
    const prices = props.map(p => p.price);
    return {
      type,
      count: props.length,
      medianPrice: calculateMedian(prices),
      averagePrice: calculateMean(prices),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      priceRange: Math.max(...prices) - Math.min(...prices),
      percentile25: calculatePercentile(prices, 25),
      percentile75: calculatePercentile(prices, 75)
    };
  });

  // Calculate metrics for each state
  const stateAnalysis = Object.entries(groupByState).map(([state, props]) => {
    const prices = props.map(p => p.price);
    return {
      state,
      count: props.length,
      medianPrice: calculateMedian(prices),
      averagePrice: calculateMean(prices),
      priceRange: Math.max(...prices) - Math.min(...prices)
    };
  }).sort((a, b) => b.count - a.count); // Sort by number of listings

  // Calculate metrics for each city within a state
  const cityAnalysisByState = Object.entries(groupByState).reduce((acc, [state, stateProps]) => {
    const groupByCity = stateProps.reduce((cityAcc, property) => {
      if (property.city) {
        cityAcc[property.city] = cityAcc[property.city] || [];
        cityAcc[property.city].push(property);
      }
      return cityAcc;
    }, {} as Record<string, Property[]>);

    acc[state] = Object.entries(groupByCity).map(([city, props]) => {
      const prices = props.map(p => p.price);
      return {
        city,
        count: props.length,
        medianPrice: calculateMedian(prices),
        averagePrice: calculateMean(prices),
        priceRange: Math.max(...prices) - Math.min(...prices)
      };
    }).sort((a, b) => b.count - a.count); // Sort by number of listings

    return acc;
  }, {} as Record<string, Array<{
    city: string;
    count: number;
    medianPrice: number;
    averagePrice: number;
    priceRange: number;
  }>>);

  // Rest of the analysis remains the same
  const roomAnalysis = Array.from(new Set(properties.map(p => p.bedrooms)))
    .sort((a, b) => a - b)
    .map(roomCount => {
      const props = properties.filter(p => p.bedrooms === roomCount);
      const prices = props.map(p => p.price);
      return {
        rooms: roomCount,
        count: props.length,
        averagePrice: calculateMean(prices),
        medianPrice: calculateMedian(prices)
      };
    });

  const furnishingAnalysis = {
    furnished: analyzeByFurnishing(properties, 'Fully furnished'),
    partiallyFurnished: analyzeByFurnishing(properties, 'Partly furnished'),
    unfurnished: analyzeByFurnishing(properties, 'Unfurnished'),
    notMentioned: analyzeByFurnishing(properties, 'Not mentioned')
  };

  return {
    typeAnalysis,
    stateAnalysis,
    cityAnalysisByState,
    roomAnalysis,
    furnishingAnalysis,
    totalListings: properties.length
  };
};

// Helper functions remain the same
const calculateMedian = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

const calculateMean = (numbers: number[]): number => 
  numbers.reduce((acc, val) => acc + val, 0) / numbers.length;

const calculatePercentile = (numbers: number[], percentile: number): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
};

const analyzeByFurnishing = (properties: Property[], furnishingType: string) => {
  const props = properties.filter(p => {
    if(furnishingType === 'Not mentioned'){
        if(p.furnishing === null || p.furnishing === ''){
            return true;
        }else{
            return false;
        }
    }
    return p.furnishing === furnishingType
});
  const prices = props.map(p => p.price);
  return {
    count: props.length,
    averagePrice: prices.length ? calculateMean(prices) : 0,
    medianPrice: prices.length ? calculateMedian(prices) : 0
  };
};