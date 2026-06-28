import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache with 5-minute TTL
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchFromFrankfurter(): Promise<Record<string, number>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD', {
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

async function fetchFromExchangerateAPI(): Promise<Record<string, number>> {
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

    return data.rates;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fallback rates (USD to various currencies)
const FALLBACK_RATES: Record<string, number> = {
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.50,
  SGD: 1.34,
  AED: 3.67,
  SEK: 10.42,
  CHF: 0.88,
  NGN: 1600,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') || '0');
    const fromCurrency = searchParams.get('from') || 'USD';

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // If from USD, return the same amount
    if (fromCurrency === 'USD') {
      return NextResponse.json({
        success: true,
        usdAmount: amount,
        originalAmount: amount,
        originalCurrency: 'USD',
        rate: 1,
      });
    }

    // Check cache first
    const now = Date.now();
    if (cachedRates && (now - cachedRates.timestamp) < CACHE_TTL) {
      const rate = cachedRates.rates[fromCurrency];
      if (rate) {
        const usdAmount = amount / rate;
        return NextResponse.json({
          success: true,
          usdAmount,
          originalAmount: amount,
          originalCurrency: fromCurrency,
          rate,
          cached: true,
        });
      }
    }

    // Fetch rates
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
        console.error('Backup API also failed, using fallback:', backupError);
        rates = FALLBACK_RATES;
      }
    }

    // Cache the rates
    cachedRates = { rates, timestamp: now };

    const rate = rates[fromCurrency];
    if (!rate) {
      return NextResponse.json(
        { error: `Unsupported currency: ${fromCurrency}` },
        { status: 400 }
      );
    }

    const usdAmount = amount / rate;

    return NextResponse.json({
      success: true,
      usdAmount,
      originalAmount: amount,
      originalCurrency: fromCurrency,
      rate,
      cached: false,
    });

  } catch (error) {
    console.error('Currency conversion error:', error);
    
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    );
  }
}
