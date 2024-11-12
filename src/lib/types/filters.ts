// src\lib\types\filters.ts

export interface FilterState {
    propertyType: string[];
    cities: string[];
    states: string[];
    priceRange: {
      min: number;
      max: number;
    };
    beds: number[];
    furnishing: string[];
}