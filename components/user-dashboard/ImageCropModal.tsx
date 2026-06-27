"use client";

import React, { useState, useCallback, useRef } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  }, []);

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  const handleConfirmCrop = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
      },
      "image/jpeg",
      0.95
    );
  }, [completedCrop, rotation, onCropComplete, onClose]);

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ cursor: "default" }}
    >
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Crop Profile Image
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Crop Stage ──
            Key fixes:
            1. The container uses flex + overflow-hidden so the image never bleeds out
            2. The image transform is applied via the `style` tag on the img only
            3. ReactCrop wraps a naturally-sized image; no max-h clipping on the wrapper
        */}
        <div className="bg-[#111] px-6 py-6 flex items-center justify-center">
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-xl"
            style={{ width: "100%", maxWidth: 420, background: "#111" }}
          >
            {/* Subtle grid background for transparency indication */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#222 25%,transparent 25%)," +
                  "linear-gradient(-45deg,#222 25%,transparent 25%)," +
                  "linear-gradient(45deg,transparent 75%,#222 75%)," +
                  "linear-gradient(-45deg,transparent 75%,#222 75%)",
                backgroundSize: "12px 12px",
                backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
              }}
            />

            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
              aspect={1}
              circularCrop
              keepSelection
              className="relative"
              style={{ cursor: "crosshair", maxWidth: "100%" }}
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "420px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </ReactCrop>
          </div>
        </div>

        {/* ── Zoom Hint ── */}
        <div className="text-center pb-1">
          <span className="text-xs text-white/30 tracking-wide">
            Drag to reposition · Use controls to zoom or rotate
          </span>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-white/10 bg-[#161616]">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom indicator */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-32 h-1 bg-white/15 rounded-full">
              <div
                className="absolute left-0 top-0 h-full bg-white/60 rounded-full transition-all"
                style={{ width: `${((scale - 0.5) / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={handleRotate}
            title="Rotate 90°"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/10 bg-[#161616]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmCrop}
            disabled={!completedCrop}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
              bg-white text-black hover:bg-white/90
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all cursor-pointer
            "
          >
            <Check className="w-4 h-4" />
            Apply Crop
          </button>
        </div>

      </div>

      {/* Scoped style overrides for react-image-crop internals */}
      <style>{`
        /* Make the drag handles and crop border cursor-pointer */
        .ReactCrop__drag-handle { cursor: pointer !important; }
        .ReactCrop__drag-bar    { cursor: move !important; }
        .ReactCrop__crop-selection {
          border: 2px solid rgba(255,255,255,0.85) !important;
          box-shadow:
            0 0 0 9999px rgba(0,0,0,0.55),
            inset 0 0 0 1px rgba(255,255,255,0.15) !important;
          cursor: move !important;
        }
        /* Rule-of-thirds grid lines */
        .ReactCrop__rule-of-thirds-vt::before,
        .ReactCrop__rule-of-thirds-vt::after,
        .ReactCrop__rule-of-thirds-hz::before,
        .ReactCrop__rule-of-thirds-hz::after {
          background-color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
    </div>
  );
}