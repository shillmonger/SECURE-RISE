"use client";
import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

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
  volume: string;
  marketStatus: string;
}

interface LiveMarketsProps {
  marketData: MarketData[];
  marketLoading: boolean;
  formattedTime: string;
}

export default function LiveMarkets({
  marketData,
  marketLoading,
  formattedTime,
}: LiveMarketsProps) {
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
    const trend = isPositive ? "Bullish" : "Bearish";
    
    return (
      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 flex-shrink-0 text-green-500" />
        ) : (
          <TrendingDown className="w-3 h-3 flex-shrink-0 text-red-500" />
        )}
        <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>{trend}</span>
        <div
          className={`flex items-center gap-1 whitespace-nowrap ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="font-medium text-xs">
            {isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

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
          className={`w-full h-full ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
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
    <section className="pt-3 border-t border-border relative">
      {/* Header Section */}
      <div className="flex justify-between mb-5 gap-2">
        <div>
          <h2 className="text-1xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Live Markets
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Real-time Cryptocurrency Prices
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
          <RefreshCw className="w-3 h-3 animate-spin text-primary" />
          <span className="hidden sm:inline">Last Update:</span> {formattedTime}
        </div>
      </div>

      {/* Market Data Container */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px] w-full">
            {/* Header Row - Converted to grid-cols-7 */}
            <div className="grid grid-cols-7 items-center bg-muted/50 border-b border-border px-6 py-4 gap-4">
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Asset
              </div>
              <div className="text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                24H Change
              </div>
              <div className="text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Price
              </div>
              <div className="text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Trend
              </div>
              <div className="text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Status
              </div>
              <div className="text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Volume
              </div>
              <div className="text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                Type
              </div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-border/50">
              {marketLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-7 items-center px-6 py-4 animate-pulse gap-4"
                    >
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-4 bg-muted rounded w-16 ml-auto"></div>
                      <div className="h-4 bg-muted rounded w-16 ml-auto"></div>
                      <div className="h-4 bg-muted rounded w-12 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-10 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-12 mx-auto"></div>
                      <div className="h-4 bg-muted rounded w-12 ml-auto"></div>
                    </div>
                  ))
                : marketData.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 items-center px-6 py-4 hover:bg-muted/30 transition-colors gap-4"
                    >
                      {/* 1. Asset */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          {item.type === "crypto" ? (
                            item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                                <span className="text-[10px] font-black text-orange-500">
                                  {item.symbol.slice(0, 2)}
                                </span>
                              </div>
                            )
                          ) : (
                            <div className="flex -space-x-2">
                              {item.baseFlag && (
                                <img
                                  src={`https://flagcdn.com/${item.baseFlag}.svg`}
                                  alt="Base currency"
                                  className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              {item.quoteFlag && (
                                <img
                                  src={`https://flagcdn.com/${item.quoteFlag}.svg`}
                                  alt="Quote currency"
                                  className="w-6 h-6 rounded-full object-cover border-2 border-background"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              {(!item.baseFlag || !item.quoteFlag) && (
                                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                                  <span className="text-[10px] font-black text-blue-500">
                                    {item.symbol.slice(0, 2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-black text-sm uppercase tracking-tighter leading-none">
                            {item.symbol}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-medium truncate">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      {/* 2. 24H Change */}
                      <div className="text-right">
                        <div className="inline-block">
                          {formatChange(item.change, item.changePercent)}
                        </div>
                      </div>

                      {/* 3. Price */}
                      <div className="text-right">
                        <div className="font-bold text-sm tracking-tight">
                          {formatPrice(item.price, item.type)}
                        </div>
                      </div>

                      {/* 4. Trend */}
                      <div className="flex justify-center">
                        <div className="w-16 flex justify-center">
                          <MiniSparkline isPositive={item.changePercent >= 0} />
                        </div>
                      </div>

                      {/* 5. Market Status - Changed to center for cleaner layout */}
                      <div className="text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border inline-block ${
                            item.marketStatus === "24/7"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {item.marketStatus}
                        </span>
                      </div>

                      {/* 6. Volume - Changed to center to balance alignment */}
                      <div className="text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {item.volume}
                        </span>
                      </div>

                      {/* 7. Type */}
                      <div className="flex justify-end">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                            item.type === "crypto"
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}