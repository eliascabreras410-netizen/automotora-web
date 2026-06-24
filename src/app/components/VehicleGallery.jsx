"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function VehicleGallery({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const imageRef = useRef(null);

  const next = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const lightboxNext = useCallback(() =>
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)), [images.length]);

  const lightboxPrev = useCallback(() =>
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)), [images.length]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom({ active: false, x: 50, y: 50 });
  };

  // Cerrar con Escape y navegar con flechas del teclado
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, lightboxNext, lightboxPrev]);

  // Zoom siguiendo el cursor
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  const handleMouseLeave = () => {
    setZoom({ active: false, x: 50, y: 50 });
  };

  return (
    <>
      <div className="w-full">

        {/* IMAGEN PRINCIPAL */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-200 shadow-2xl">

          {/* Imagen clickeable */}
          <div
            className="relative w-full cursor-zoom-in"
            style={{ paddingBottom: "66%" }}
            onClick={() => openLightbox(currentIndex)}
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
              priority
            />
          </div>

          {/* Flecha izquierda */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white shadow-lg transition hover:bg-black"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Flecha derecha */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Siguiente imagen"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white shadow-lg transition hover:bg-black"
          >
            <ChevronRight size={24} />
          </button>

          {/* Puntos indicadores */}
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                aria-label={`Ir a imagen ${index + 1}`}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* MINIATURAS */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                currentIndex === index
                  ? "border-green-600 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ width: "100px", height: "70px" }}
            >
              <Image
                src={image}
                alt={`${alt} miniatura ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/30"
          >
            <X size={28} />
          </button>

          {/* Contador */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1 text-sm text-white">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Flecha izquierda */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            className="absolute left-4 z-50 rounded-full bg-black/60 p-3 text-white transition hover:bg-black"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Imagen con zoom */}
          <div
            ref={imageRef}
            className="relative mx-16 max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl"
            style={{ aspectRatio: "16/10" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${alt} ${lightboxIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain transition-transform duration-100"
              style={{
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transform: zoom.active ? "scale(2)" : "scale(1)",
              }}
            />
          </div>

          {/* Flecha derecha */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            className="absolute right-4 z-50 rounded-full bg-black/60 p-3 text-white transition hover:bg-black"
          >
            <ChevronRight size={32} />
          </button>

          {/* Miniaturas en lightbox */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  lightboxIndex === index ? "border-green-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                }`}
                style={{ width: "70px", height: "50px" }}
              >
                <Image
                  src={image}
                  alt={`miniatura ${index + 1}`}
                  fill
                  sizes="70px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}