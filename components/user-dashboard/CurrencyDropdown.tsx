"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";

export default function CurrencyDropdown() {
  const { currency, setCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 w-full rounded-lg transition-colors cursor-pointer hover:bg-primary/20"
      >
        <span className="text-[14px] font-black uppercase tracking-widest text-muted-foreground">{selectedCurrency.flag}</span>
        <span className="text-xs font-black uppercase tracking-tight hidden sm:block">
          {selectedCurrency.code}
        </span>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 top-full mt-2 w-[280px] max-h-[400px] overflow-y-auto rounded-xl border border-border bg-background shadow-xl z-50">
          <div className="p-2">
            <div className="sticky top-0 bg-background py-2 border-b border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
                Select Currency
              </p>
            </div>
            <div className="space-y-1">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    currency === curr.code
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-xl">{curr.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-black uppercase tracking-tight">
                      {curr.code}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {curr.name}
                    </p>
                  </div>
                  {currency === curr.code && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
