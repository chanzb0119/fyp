// src\services\properties.ts

import { supabase } from '@/lib/supabase/client';
import { Property } from '@/lib/types/database';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const propertyService = {

  async getPaginatedProperties(
    params: PaginationParams,
    filters?: {
      propertyState?: string;
      propertyType?: string;
      minPrice?: string;
      maxPrice?: string;
      beds?: string;
      searchTerm?: string;
      sort?: string;
    }
  ): Promise<PaginatedResponse<Property>> {
    const { page = 1, limit = 12 } = params;
    const offset = (page - 1) * limit;

    // Start building the query
    let query = supabase
      .from('property')
      .select('*', { count: 'exact' });

    // Apply filters if they exist
    if (filters) {
      if (filters.propertyState) {
        query = query.eq('state', filters.propertyState);
      }
      if (filters.propertyType) {
        query = query.eq('type', filters.propertyType);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.beds) {
        query = query.eq('beds', parseInt(filters.beds));
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,city.ilike.%${filters.searchTerm}%,state.ilike.%${filters.searchTerm}%`);
      }

      // Apply sorting
      switch (filters.sort) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'size_desc':
          query = query.order('size', { ascending: false });
          break;
        case 'size_asc':
          query = query.order('size', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
    }

    // Add pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: data || [],
      totalCount: count || 0,
      totalPages,
      currentPage: page
    };
  },
  
  async createProperty(property: Omit<Property, 'property_id'>) {
    const { data, error } = await supabase
      .from('property')
      .insert(property)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProperties() {
    const { data, error } = await supabase
      .from('property')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPropertyById(property_id: string) {
    const { data, error } = await supabase
      .from('property')
      .select('*')
      .eq('property_id', property_id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProperty(property_id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('property')
      .update(updates)
      .eq('property_id', property_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProperty(property_id: string) {
    const { error } = await supabase
      .from('property')
      .delete()
      .eq('property_id', property_id);

    if (error) throw error;
    return true;
  }
};