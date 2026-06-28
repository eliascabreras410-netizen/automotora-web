import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Calendar, Gauge, Fuel, Settings } from "lucide-react";
import VehicleGallery from "../../components/VehicleGallery";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const revalidate = 60

export default async function VehiculoPage({ params }) {
  const { id } = await params
  const { data: auto } = await supabase
    .from("autos")
    .select("*")
    .eq("id", id)
    .single()

  if (!auto) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black text-2xl mb-4">Vehículo no encontrado</p>
          <Link href="/" className="text-green-600 hover:text-green-500 font-semibold">← Volver al stock</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <Link href="/" className="mb-8 inline-block text-base font-semibold text-green-600 hover:text-green-500">
          ← Volver a stock
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">

          <div>
            <VehicleGallery images={auto.imagenes || []} alt={auto.marca + " " + auto.modelo} />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{auto.marca}</span>
            <h1 className="text-5xl font-extrabold text-black">{auto.modelo}</h1>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-100 p-5">
                <Calendar className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">AÑO</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.ano}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Gauge className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">KILÓMETROS</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.km?.toLocaleString()} km</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Fuel className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">MOTOR</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.motor}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <Settings className="text-green-600" size={28} />
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">TRANSMISIÓN</p>
                <p className="mt-1 text-xl font-bold text-black">{auto.transmision}</p>
              </div>
            </div>

            {auto.especificaciones && auto.especificaciones.length > 0 && (
              <div className="rounded-2xl bg-gray-100 p-5">
                <h2 className="text-xs font-semibold uppercase text-gray-400 mb-3">ESPECIFICACIONES</h2>
                <div className="grid grid-cols-2 gap-2">
                  {auto.especificaciones.map((e) => (
                    <p key={e} className="text-base text-gray-700 flex items-center gap-2">
                      <span className="text-green-600">✓</span> {e}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-gray-100 p-5">
              <p className="text-xs font-semibold uppercase text-gray-400">PRECIO</p>
              <p className="mt-1 text-3xl font-extrabold text-green-600">
                {auto.precio ? "USD " + auto.precio.toLocaleString() : "Consultar precio"}
              </p>
            </div>

            {auto.beneficios && auto.beneficios.length > 0 && (
              <div className="rounded-2xl bg-gray-100 p-5">
                <h2 className="text-xs font-semibold uppercase text-gray-400 mb-3">BENEFICIOS</h2>
                <div className="space-y-2">
                  {auto.beneficios.map((b) => (
                    <p key={b} className="text-base text-gray-700 flex items-center gap-2">
                      <span className="text-green-600">✓</span> {b}
                    </p>
                  ))}
                </div>
              </div>
            )}
          <a
            href={`https://wa.me/59899182849?text=${encodeURIComponent(`Hola Alvaro, me interesa el ${auto.marca} ${auto.modelo} ${auto.ano} que vi en tu página. ¿Está disponible?`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-2xl bg-green-600 py-4 text-center text-lg font-bold text-white transition hover:bg-green-500">
            Consultar por WhatsApp
          </a>
          </div>

        </div>
      </div>
    </main>
  )
}
