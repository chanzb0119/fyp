// src/app/api/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, propertyId, limit = 6 } = await req.json();

    // Call your FastAPI similar properties endpoint with query parameters
    const url = new URL('https://property-recommender-api.onrender.com/hybrid-recommendations');
    // const url = new URL('http://localhost:8000/hybrid-recommendations');
    url.searchParams.append('property_id', propertyId);
    url.searchParams.append('user_id', userId);
    url.searchParams.append('top_n', limit.toString());
    url.searchParams.append('alpha', '0.6');
    url.searchParams.append('beta', '0.4');
    
    // Call FastAPI recommendation service
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const recommendations = await response.json();
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}