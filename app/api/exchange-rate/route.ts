import { NextRequest, NextResponse } from 'next/server';

// Fallback exchange rates if API fails (will be updated periodically)
const FALLBACK_RATES: Record<string, number> = {
  NGN: 1600,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  BRL: 4.97,
  MXN: 17.15,
  ZAR: 18.92,
  KES: 153.50,
  GHS: 15.20,
  EGP: 30.90,
  TRY: 32.50,
  RUB: 92.50,
  KRW: 1320.00,
  SGD: 1.34,
  HKD: 7.82,
  NZD: 1.66,
  SEK: 10.45,
  NOK: 10.65,
  DKK: 6.85,
  PLN: 3.95,
  THB: 35.80,
  IDR: 15650,
  MYR: 4.72,
  PHP: 56.20,
  VND: 24350,
  PKR: 278.50,
  BDT: 109.80,
  LKR: 322.50,
  NPR: 133.20,
  UAH: 37.50,
};

// Simple in-memory cache with 5-minute TTL
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchFromFrankfurter(targetCurrency?: string): Promise<Record<string, number>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const url = targetCurrency 
      ? `https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`
      : 'https://api.frankfurter.app/latest?from=USD';
    
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Frankfurter API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates) {
      throw new Error('Invalid exchange rate data structure');
    }

    return data.rates;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchFromExchangerateAPI(targetCurrency?: string): Promise<Record<string, number>> {
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

    if (!data.rates) {
      throw new Error('Invalid exchange rate data structure');
    }

    // If specific currency requested, return only that rate
    if (targetCurrency && data.rates[targetCurrency]) {
      return { [targetCurrency]: data.rates[targetCurrency] };
    }

    return data.rates;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetCurrency = searchParams.get('currency')?.toUpperCase();

    // Check cache first
    const now = Date.now();
    if (cachedRates && (now - cachedRates.timestamp) < CACHE_TTL) {
      console.log('Using cached exchange rates');
      
      if (targetCurrency && cachedRates.rates[targetCurrency]) {
        return NextResponse.json({
          success: true,
          rate: cachedRates.rates[targetCurrency],
          currency: targetCurrency,
          cached: true,
        });
      } else if (targetCurrency) {
        // Currency not in cache, fetch it
        return await fetchSingleCurrency(targetCurrency);
      }
      
      return NextResponse.json({
        success: true,
        rates: cachedRates.rates,
        cached: true,
      });
    }

    // Try to fetch all rates
    let rates: Record<string, number>;
    try {
      rates = await fetchFromFrankfurter();
      console.log('Fetched rates from Frankfurter');
    } catch (error) {
      console.error('Frankfurter API failed, trying backup:', error);
      
      try {
        rates = await fetchFromExchangerateAPI();
        console.log('Fetched rates from ExchangeRate-API');
      } catch (backupError) {
        console.error('Backup API also failed:', backupError);
        
        // Use fallback rates
        rates = FALLBACK_RATES;
        console.log('Using fallback exchange rates');
      }
    }

    // Cache the rates
    cachedRates = { rates, timestamp: now };

    // Return specific rate if requested
    if (targetCurrency && rates[targetCurrency]) {
      return NextResponse.json({
        success: true,
        rate: rates[targetCurrency],
        currency: targetCurrency,
        cached: false,
      });
    } else if (targetCurrency) {
      // Currency not found, try to fetch it specifically
      return await fetchSingleCurrency(targetCurrency);
    }

    return NextResponse.json({
      success: true,
      rates,
      cached: false,
    });

  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    
    // Return fallback rates as last resort
    const { searchParams } = new URL(request.url);
    const targetCurrency = searchParams.get('currency')?.toUpperCase();
    
    if (targetCurrency && FALLBACK_RATES[targetCurrency]) {
      return NextResponse.json({
        success: true,
        rate: FALLBACK_RATES[targetCurrency],
        currency: targetCurrency,
        fallback: true,
      });
    }
    
    return NextResponse.json({
      success: true,
      rates: FALLBACK_RATES,
      fallback: true,
    });
  }
}

async function fetchSingleCurrency(targetCurrency: string): Promise<NextResponse> {
  try {
    let rate: number;
    try {
      const rates = await fetchFromFrankfurter(targetCurrency);
      rate = rates[targetCurrency];
    } catch (error) {
      console.error('Frankfurter API failed for single currency, trying backup:', error);
      
      try {
        const rates = await fetchFromExchangerateAPI(targetCurrency);
        rate = rates[targetCurrency];
      } catch (backupError) {
        console.error('Backup API also failed:', backupError);
        rate = FALLBACK_RATES[targetCurrency] || 1;
      }
    }

    return NextResponse.json({
      success: true,
      rate,
      currency: targetCurrency,
      cached: false,
    });
  } catch (error) {
    console.error('Single currency fetch error:', error);
    return NextResponse.json({
      success: true,
      rate: FALLBACK_RATES[targetCurrency] || 1,
      currency: targetCurrency,
      fallback: true,
    });
  }
}
