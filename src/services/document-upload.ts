// src/services/document-upload.ts
import { supabase } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadDocument(file: File) {
  try {
    if (!file.type.includes('pdf')) {
      throw new Error('Only PDF files are allowed');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `property-documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}