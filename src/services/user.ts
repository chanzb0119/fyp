// src/services/user.ts
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types/database';

export const userService = {
  async getUserById(userId: string): Promise<Partial<UserProfile> | null> {
    const { data, error } = await supabase
      .from('user')
      .select('user_id, name, profile_image, role, phone')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }
};