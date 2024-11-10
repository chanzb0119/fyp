// src/lib/types/database.ts

export interface Property {
    id: string;
    created_at: string;
    title: string;
    type: string;
    price: number;
    beds: number;
    bathrooms: number;
    carparks: number;
    size: number;
    description: string;
    address: string;
    state: string;
    city: string;
    amenities: string[];
    user_id: string;
    images: string[];
    latitude: number;
    longitude: number;
    furnishing: string;
  }
  
  export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    created_at: string;
  }
  
  export interface Database {
    public: {
      Tables: {
        properties: {
          Row: Property;
          Insert: Omit<Property, 'id' | 'created_at'>;
          Update: Partial<Omit<Property, 'id' | 'created_at'>>;
        };
        users: {
          Row: User;
          Insert: Omit<User, 'id' | 'created_at'>;
          Update: Partial<Omit<User, 'id' | 'created_at'>>;
        };
      };
    };
  }