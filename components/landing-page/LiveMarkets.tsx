"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

// Market Data Interface
interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: "forex" | "crypto";
  image?: string;
  coinId?: string;
  baseFlag?: string;
  quoteFlag?: string;
}

export default function LiveMarkets() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [formattedTime, setFormattedTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 20 mixed pairs: crypto and forex alternated
  const allPairs: MarketData[] = [
    // Crypto
    {
      symbol: "BTC/USD",
      name: "Bitcoin",
      price: 67432.5,
      change: 1234.5,
      changePercent: 1.87,
      type: "crypto",
      coinId: "bitcoin",
    },
    // Forex
    {
      symbol: "XAUUSD",
      name: "Gold vs US Dollar",
      price: 2345.67,
      change: 12.34,
      changePercent: 0.53,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "us",
    },
    // Crypto
    {
      symbol: "ETH/USD",
      name: "Ethereum",
      price: 3456.78,
      change: -45.22,
      changePercent: -1.29,
      type: "crypto",
      coinId: "ethereum",
    },
    // Forex
    {
      symbol: "EURUSD",
      name: "Euro vs US Dollar",
      price: 1.0845,
      change: 0.0023,
      changePercent: 0.21,
      type: "forex",
      baseFlag: "eu",
      quoteFlag: "us",
    },
    // Crypto
    {
      symbol: "BNB/USD",
      name: "Binance Coin",
      price: 578.92,
      change: 12.45,
      changePercent: 2.2,
      type: "crypto",
      coinId: "binancecoin",
    },
    // Forex
    {
      symbol: "GBPUSD",
      name: "British Pound vs US Dollar",
      price: 1.2723,
      change: -0.0089,
      changePercent: -0.70,
      type: "forex",
      baseFlag: "gb",
      quoteFlag: "us",
    },
    // Crypto
    {
      symbol: "SOL/USD",
      name: "Solana",
      price: 178.92,
      change: 8.45,
      changePercent: 4.96,
      type: "crypto",
      coinId: "solana",
    },
    // Forex
    {
      symbol: "USDJPY",
      name: "US Dollar vs Japanese Yen",
      price: 149.87,
      change: 0.45,
      changePercent: 0.30,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "jp",
    },
    // Crypto
    {
      symbol: "ADA/USD",
      name: "Cardano",
      price: 0.623,
      change: 0.012,
      changePercent: 1.96,
      type: "crypto",
      coinId: "cardano",
    },
    // Forex
    {
      symbol: "AUDUSD",
      name: "Australian Dollar vs US Dollar",
      price: 0.6543,
      change: -0.0034,
      changePercent: -0.52,
      type: "forex",
      baseFlag: "au",
      quoteFlag: "us",
    },
    // Crypto
    {
      symbol: "XRP/USD",
      name: "Ripple",
      price: 0.5234,
      change: -0.0089,
      changePercent: -1.67,
      type: "crypto",
      coinId: "ripple",
    },
    // Forex
    {
      symbol: "USDCAD",
      name: "US Dollar vs Canadian Dollar",
      price: 1.3654,
      change: 0.0067,
      changePercent: 0.49,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "ca",
    },
    // Crypto
    {
      symbol: "DOGE/USD",
      name: "Dogecoin",
      price: 0.1567,
      change: 0.0034,
      changePercent: 2.22,
      type: "crypto",
      coinId: "dogecoin",
    },
    // Forex
    {
      symbol: "NZDUSD",
      name: "New Zealand Dollar vs US Dollar",
      price: 0.6123,
      change: 0.0012,
      changePercent: 0.20,
      type: "forex",
      baseFlag: "nz",
      quoteFlag: "us",
    },
    // Crypto
    {
      symbol: "DOT/USD",
      name: "Polkadot",
      price: 7.892,
      change: -0.156,
      changePercent: -1.94,
      type: "crypto",
      coinId: "polkadot",
    },
    // Forex
    {
      symbol: "USDCHF",
      name: "US Dollar vs Swiss Franc",
      price: 0.8976,
      change: -0.0023,
      changePercent: -0.26,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "ch",
    },
    // Crypto
    {
      symbol: "TRXUSDT",
      name: "TRON",
      price: 0.12,
      change: 0.002,
      changePercent: 1.69,
      type: "crypto",
      coinId: "tron",
    },
    // Forex
    {
      symbol: "EURGBP",
      name: "Euro vs British Pound",
      price: 0.8523,
      change: 0.0015,
      changePercent: 0.18,
      type: "forex",
      baseFlag: "eu",
      quoteFlag: "gb",
    },
    // Crypto
    {
      symbol: "AVAX/USD",
      name: "Avalanche",
      price: 38.92,
      change: 1.23,
      changePercent: 3.27,
      type: "crypto",
      coinId: "avalanche-2",
    },
    // Forex
    {
      symbol: "USDHKD",
      name: "US Dollar vs Hong Kong Dollar",
      price: 7.8234,
      change: -0.0012,
      changePercent: -0.02,
      type: "forex",
      baseFlag: "us",
      quoteFlag: "hk",
    },
  ];

  useEffect(() => {
    // Fetch crypto logos from CoinGecko and prepare forex data
    const fetchMarketData = async () => {
      try {
        // Get only crypto pairs for CoinGecko API
        const cryptoPairs = allPairs.filter(pair => pair.type === "crypto");
        const coinIds = cryptoPairs.map((crypto) => crypto.coinId).join(",");
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
        );
        const data = await response.json();

        // Create a map of coinId to image for quick lookup
        const cryptoImageMap = new Map();
        cryptoPairs.forEach((crypto) => {
          const coinGeckoData = data.find((item: any) => item.id === crypto.coinId);
          cryptoImageMap.set(crypto.coinId, coinGeckoData?.image || "");
        });

        // Update all pairs maintaining original mixed order
        const updatedData = allPairs.map((pair) => {
          if (pair.type === "crypto" && pair.coinId) {
            return {
              ...pair,
              image: cryptoImageMap.get(pair.coinId) || "",
            };
          }
          return pair; // Forex pairs remain unchanged
        });

        setMarketData(updatedData);
        setMarketLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setMarketData(allPairs);
        setMarketLoading(false);
      }
    };

    fetchMarketData();

    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setFormattedTime(now.toLocaleTimeString());
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Simulate real-time price updates every 2 seconds
    const priceInterval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((item) => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * item.price * 0.001,
          change: (Math.random() - 0.5) * item.price * 0.002,
          changePercent: (Math.random() - 0.5) * 2,
        }))
      );
    }, 2000);

    // Simulate real-time price updates every 2 seconds
    const priceInterval2 = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((item) => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * item.price * 0.001,
          change: (Math.random() - 0.5) * item.price * 0.002,
          changePercent: (Math.random() - 0.5) * 2,
        }))
      );
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, []);

  // Refresh function
  const refreshMarketData = async () => {
    setIsRefreshing(true);
    try {
      // Get only crypto pairs for CoinGecko API
      const cryptoPairs = allPairs.filter(pair => pair.type === "crypto");
      const coinIds = cryptoPairs.map((crypto) => crypto.coinId).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
      );
      const data = await response.json();

      // Create a map of coinId to image for quick lookup
      const cryptoImageMap = new Map();
      cryptoPairs.forEach((crypto) => {
        const coinGeckoData = data.find((item: any) => item.id === crypto.coinId);
        cryptoImageMap.set(crypto.coinId, coinGeckoData?.image || "");
      });

      // Update all pairs maintaining original mixed order
      const updatedData = allPairs.map((pair) => {
        if (pair.type === "crypto" && pair.coinId) {
          return {
            ...pair,
            image: cryptoImageMap.get(pair.coinId) || "",
            price: pair.price + (Math.random() - 0.5) * pair.price * 0.005, // Add some variation
            change: (Math.random() - 0.5) * pair.price * 0.01,
            changePercent: (Math.random() - 0.5) * 5,
          };
        }
        return {
          ...pair,
          price: pair.price + (Math.random() - 0.5) * pair.price * 0.005, // Add some variation for forex too
          change: (Math.random() - 0.5) * pair.price * 0.01,
          changePercent: (Math.random() - 0.5) * 5,
        };
      });

      setMarketData(updatedData);
    } catch (error) {
      console.error("Error refreshing market data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatPrice = (price: number, type: "forex" | "crypto") => {
    if (type === "crypto") {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toFixed(4);
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 whitespace-nowrap ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
        ) : (
          <TrendingDown className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="font-medium text-xs">
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };

  // Mini Sparkline Component for Trend Visualization
  const MiniSparkline = ({ isPositive }: { isPositive: boolean }) => {
    const generateSparklineData = () => {
      const points = 8;
      const data = [];
      let baseValue = 50;

      for (let i = 0; i < points; i++) {
        const volatility = Math.random() * 20 - 10;
        const trend = isPositive ? i * 2 : -i * 2;
        baseValue += volatility + trend * 0.5;
        data.push(Math.max(10, Math.min(90, baseValue)));
      }

      return data;
    };

    const sparklineData = generateSparklineData();
    const maxData = Math.max(...sparklineData);
    const minData = Math.min(...sparklineData);
    const range = maxData - minData || 1;

    const pathData = sparklineData
      .map((value, index) => {
        const x = (index / (sparklineData.length - 1)) * 100;
        const y = ((maxData - value) / range) * 80 + 10;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <div className="relative w-12 h-6">
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isPositive ? "text-green-500" : "text-red-500"}`}
        >
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <circle
            cx="100"
            cy={
              ((maxData - sparklineData[sparklineData.length - 1]) / range) *
                80 +
              10
            }
            r="3"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-10 w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Live Markets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time cryptocurrency and forex prices with live updates
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span>Last Update: {formattedTime}</span>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="flex justify-between items-center bg-muted/50 border-b border-border px-6 py-4">
                <div className="flex-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Asset</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Price</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">24h Change</div>
                <div className="flex-1 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">Trend</div>
                <div className="flex-1 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Type</div>
              </div>

              {/* Data Rows */}
              <div className="divide-y divide-border/50">
                {marketLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center px-6 py-4 animate-pulse">
                        <div className="flex-1 h-4 bg-muted rounded w-32"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-20 ml-auto"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-20 ml-auto"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-12 mx-auto"></div>
                        <div className="flex-1 h-4 bg-muted rounded w-10 ml-auto"></div>
                      </div>
                    ))
                  : marketData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-6 py-4 hover:bg-muted/30 transition-colors flex-nowrap"
                      >
                        {/* Asset */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <div className="relative flex-shrink-0">
                            {item.type === "crypto" ? (
                              // Crypto logos
                              item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded-full object-cover border border-border"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                                  <span className="text-[10px] font-black text-orange-500">{item.symbol.slice(0, 2)}</span>
                                </div>
                              )
                            ) : (
                              // Forex flags
                              <div className="flex -space-x-2">
                                {item.baseFlag && (
                                  <img
                                    src={`https://flagcdn.com/${item.baseFlag}.svg`}
                                    alt="Base currency"
                                    className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                {item.quoteFlag && (
                                  <img
                                    src={`https://flagcdn.com/${item.quoteFlag}.svg`}
                                    alt="Quote currency"
                                    className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                {(!item.baseFlag || !item.quoteFlag) && (
                                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                                    <span className="text-[10px] font-black text-blue-500">{item.symbol.slice(0, 2)}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <div className="font-black text-sm uppercase tracking-tighter leading-none">{item.symbol}</div>
                            <div className="text-[10px] text-muted-foreground font-medium truncate">{item.name}</div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-1 text-right">
                          <div className="font-bold text-sm tracking-tight">
                            {formatPrice(item.price, item.type)}
                          </div>
                        </div>

                        {/* Change */}
                        <div className="flex-1 text-right">
                          <div className="inline-block">
                            {formatChange(item.change, item.changePercent)}
                          </div>
                        </div>

                        {/* Trend */}
                        <div className="flex-1 flex justify-center">
                          <div className="w-16">
                            <MiniSparkline isPositive={item.changePercent >= 0} />
                          </div>
                        </div>

                        {/* Type */}
                        <div className="flex-1 flex justify-end">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                            item.type === "crypto"
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button 
            onClick={refreshMarketData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Pairs'}
          </button>
        </div>
      </div>
    </section>
  );
}