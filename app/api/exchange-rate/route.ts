import { NextRequest, NextResponse } from 'next/server';

// Fallback exchange rate if API fails (will be updated periodically)
const FALLBACK_EXCHANGE_RATE = 1600;

// Simple in-memory cache with 5-minute TTL
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchFromFrankfurter(): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=NGN', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Frankfurter API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates || !data.rates.NGN) {
      throw new Error('Invalid exchange rate data structure');
    }

    return data.rates.NGN;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchFromExchangerateAPI(): Promise<number> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ExchangeRate-API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates || !data.rates.NGN) {
      throw new Error('Invalid exchange rate data structure');
    }

    return data.rates.NGN;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedRate && (now - cachedRate.timestamp) < CACHE_TTL) {
      console.log('Using cached exchange rate:', cachedRate.rate);
      return NextResponse.json({
        success: true,
        rate: cachedRate.rate,
        cached: true,
      });
    }

    // Try Frankfurter API first
    let rate: number;
    try {
      rate = await fetchFromFrankfurter();
      console.log('Fetched rate from Frankfurter:', rate);
    } catch (error) {
      console.error('Frankfurter API failed, trying backup:', error);
      
      // Try backup API
      try {
        rate = await fetchFromExchangerateAPI();
        console.log('Fetched rate from ExchangeRate-API:', rate);
      } catch (backupError) {
        console.error('Backup API also failed:', backupError);
        
        // Use fallback rate
        rate = FALLBACK_EXCHANGE_RATE;
        console.log('Using fallback exchange rate:', rate);
      }
    }

    // Cache the rate
    cachedRate = { rate, timestamp: now };

    return NextResponse.json({
      success: true,
      rate,
      cached: false,
    });

  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    
    // Return fallback rate as last resort
    return NextResponse.json({
      success: true,
      rate: FALLBACK_EXCHANGE_RATE,
      fallback: true,
    });
  }
}
