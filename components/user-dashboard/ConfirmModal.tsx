"use client";

import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              type === "danger" ? "bg-red-100" : "bg-yellow-100"
            }`}>
              {type === "danger" ? (
                <Trash2 className="h-4 w-4 text-red-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight leading-none">
                {title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary cursor-pointer rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>

          {/* Warning Box for Danger Type */}
          {type === "danger" && (
            <div className="mt-4 p-4 bg-red-50/50 border border-red-200/50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[11px] font-black text-red-800 uppercase tracking-tight leading-none">
                    This action cannot be undone
                  </h3>
                  <p className="text-[9px] text-red-700 font-medium mt-1">
                    Please be certain before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border bg-secondary/20">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-background cursor-pointer border border-border text-foreground py-3 px-4 rounded-lg font-black hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tight text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 cursor-pointer rounded-lg font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tight text-sm flex items-center justify-center gap-2 ${
              type === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
