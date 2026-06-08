"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VehicleGallery({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="w-full">

      {/* IMAGEN PRINCIPAL */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-200 shadow-2xl">

        {/* Imagen */}
        <div className="relative w-full" style={{ paddingBottom: "66%" }}>
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
          onClick={prev}
          aria-label="Imagen anterior"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white shadow-lg transition hover:bg-black"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Flecha derecha */}
        <button
          type="button"
          onClick={next}
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
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a imagen ${index + 1}`}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-white scale-125"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MINIATURAS */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden">
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
  );
}