// src/lib/types/database.ts

export interface Property {
    id: string;
    created_at: string;
    title: string;
    type: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    size: number;
    description: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    city: string;
    amenities: string[];
    user_id: string;
    status: 'draft' | 'published' | 'archived';
    images: string[];
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