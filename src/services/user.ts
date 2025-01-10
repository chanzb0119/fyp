// src/services/user.ts
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types/database';

export const userService = {
  async getUserProfileImageById(userId: string) {
    const { data, error } = await supabase
      .from('user')
      .select('profile_image')
      .eq('user_id', userId)
      .single();
  
    if (error) {
      throw error;
    }
  
    return data;
  },

  async getUserById(userId: string): Promise<Partial<UserProfile>> {
    const { data, error } = await supabase
      .from('user')
      .select('user_id, name, profile_image, role, phone, email, created_at, updated_at, email_verified')
      .eq('user_id', userId)
      .single();
  
    if (error) {
      throw error;
    }
  
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<Partial<UserProfile>> {
    const { data, error } = await supabase
      .from('user')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('user_id, name, profile_image, role, phone, email')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async getWishlist(userId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        property_id,
        property:property_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data.map((item: any) => item.property);
  },

  async addToWishlist(userId: string, propertyId: string) {
    const { error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        property_id: propertyId,
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return true;
  },

  async removeFromWishlist(userId: string, propertyId: string) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      throw error;
    }

    return true;
  }
};