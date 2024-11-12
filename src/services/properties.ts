// src\services\properties.ts

import { supabase } from '@/lib/supabase/client';
import { Property, User } from '@/lib/types/database';

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
    }
  ): Promise<PaginatedResponse<Property>> {
    const { page = 1, limit = 12 } = params;
    const offset = (page - 1) * limit;

    // Start building the query
    let query = supabase
      .from('properties')
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
    }

    // Add pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
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
  
  async createProperty(property: Omit<Property, 'id'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPropertyById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};