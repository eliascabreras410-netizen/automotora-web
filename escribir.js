const fs = require('fs');

const codigo = `"use client";
import Link from "next/link";
import { vehiculos } from "../../data/vehiculos";
import { Calendar, Gauge, Fuel, Settings } from "lucide-react";
import VehicleGallery from "../../components/VehicleGallery";
import React from "react";

export default function VehiculoPage({ params }) {
  const { id } = React.use(params);
  const auto = vehiculos.find((v) => v.id === id);

  if (!auto) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black text-2xl">Vehiculo no encontrado</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <Link href="/" className="mb-8 inline-block text-base font-semibold text-green-600 hover:text-green-500">
          Volver a stock
        </Link>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginTop: "24px"}}>

          <div>
            <VehicleGallery images={auto.imagenes} alt={auto.marca + " " + auto.modelo} />
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{auto.marca}</span>
            <h1 className="text-5xl font-extrabold text-black">{auto.modelo}</h1>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Calendar className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">Ano</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.ano}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Gauge className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">Kilometros</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.km.toLocaleString()} km</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Fuel className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">Motor</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.motor}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Settings className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">Transmision</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.transmision}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-100 p-5">
              <p className="text-xs font-semibold uppercase text-gray-400">Precio</p>
              <p className="mt-1 text-3xl font-extrabold text-green-600">
                {auto.precio ? "USD " + auto.precio.toLocaleString() : "Consultar precio"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-5">
              <h2 className="text-sm font-semibold uppercase text-gray-400">Beneficios</h2>
              <div className="mt-3 space-y-2">
                {auto.beneficios.map((b) => (
                  <p key={b} className="text-base text-gray-700">checkmark {b}</p>
                ))}
              </div>
            </div>

            <a href="https://wa.me/59899182849" target="_blank" rel="noreferrer" className="w-full rounded-2xl bg-green-600 py-4 text-center text-lg font-bold text-white transition hover:bg-green-500">
              Consultar por WhatsApp
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
`;

fs.writeFileSync('src/app/vehiculos/[id]/page.js', codigo);
console.log('Listo!');