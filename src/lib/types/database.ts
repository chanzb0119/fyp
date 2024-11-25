// src\lib\types\database.ts

export interface Property {
    property_id: string;
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

  export interface UserProfile {
    user_id: string;
    email: string;
    name: string | null;
    phone: string | null;
    profile_image: string | null;
    role: 'user' | 'landlord' | 'admin';
    password: string;  // Will store hashed password
    created_at: string;
    updated_at: string;
    email_verified: boolean;
    verification_token?: string | null;
    verification_token_expires?: string | null;
    google_id?: string | null;
  }
  
  
  
  export interface Database {
    public: {
      Tables: {
        properties: {
          Row: Property;
          Insert: Omit<Property, 'id' | 'created_at'>;
          Update: Partial<Omit<Property, 'id' | 'created_at'>>;
        };
      };
    };
  }