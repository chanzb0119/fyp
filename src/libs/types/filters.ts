export interface FilterState {
    propertyType: string[];
    cities: string[];
    states: string[];
    priceRange: {
      min: number;
      max: number;
    };
    bedrooms: number[];
    furnishing: string[];
}