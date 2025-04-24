// src/app/api/similar-properties/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { propertyId, limit = 5 } = await req.json();
    // Call your FastAPI similar properties endpoint with query parameters
    const url = new URL('http://localhost:8000/similar-properties/');
    url.searchParams.append('property_id', propertyId);
    url.searchParams.append('top_n', limit.toString());
    
    // Call your FastAPI similar properties endpoint
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const similarProperties = await response.json();
    
    return NextResponse.json({ similarProperties });
  } catch (error) {
    console.error('Similar properties error:', error);
    return NextResponse.json({ error: 'Failed to get similar properties' }, { status: 500 });
  }
}