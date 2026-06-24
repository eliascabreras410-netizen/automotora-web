import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import StockClient from "./components/StockClient";
import ScrollReveal from "./components/ScrollReveal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const revalidate = 60

export default async function Home() {
  const { data: vehiculos } = await supabase
    .from("autos")
    .select("*")
    .order("created_at", { ascending: false })

  const autos = vehiculos || []

  return (
    <>
      <main
        id="inicio"
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/auto.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10">

          {/* NAVBAR */}
          <nav className="flex items-center justify-between px-5 py-5 text-white md:px-10 md:py-6">
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-wide md:text-3xl">Alvaro Gervasini</span>
              <span className="text-xs font-semibold tracking-[0.2em] text-green-400 uppercase md:text-sm">Automóviles</span>
            </div>
            <div className="flex gap-4 text-sm font-medium md:gap-8 md:text-lg">
              <a href="#inicio" className="transition hover:text-green-400">Inicio</a>
              <a href="#vehiculos" className="transition hover:text-green-400">Vehículos</a>
              <Link href="/resenas" className="transition hover:text-green-400">Reseñas</Link>
              <Link href="/ventas" className="transition hover:text-green-400">Ventas</Link>
              <a href="#contacto" className="transition hover:text-green-400">Contacto</a>
            </div>
          </nav>

          {/* HERO */}
          <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Encontrá tu próximo <span className="text-green-400">vehículo</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-gray-200 sm:text-xl">
              Calidad, confianza y los mejores precios. Financiación y permuta disponible.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="https://wa.me/59899182849" target="_blank" rel="noreferrer"
                className="w-full rounded-2xl bg-green-500 px-8 py-4 text-base font-bold shadow-lg transition hover:scale-105 hover:bg-green-600 sm:w-auto sm:text-lg">
                Contactar por WhatsApp
              </a>
              <a href="#vehiculos"
                className="w-full rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-base font-bold transition hover:bg-white/20 sm:w-auto sm:text-lg">
                Ver stock
              </a>
            </div>
          </div>

        </div>
      </main>
      
      {/* SECCIÓN POR QUÉ ELEGIRNOS */}
<section className="bg-white px-5 py-16 md:px-10 md:py-20">
  <div className="mx-auto max-w-6xl">
    <ScrollReveal>
      <h2 className="mb-12 text-center text-3xl font-bold text-black md:text-4xl">
        ¿Por qué <span className="text-green-500">elegirnos?</span>
      </h2>
    </ScrollReveal>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

      <ScrollReveal delay={0}>
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">🤝</div>
          <h3 className="mb-2 text-lg font-bold text-black">Financiación disponible</h3>
          <p className="text-sm text-gray-500">Comprá tu auto en cuotas accesibles y llevátelo hoy.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">🔄</div>
          <h3 className="mb-2 text-lg font-bold text-black">Acepta permuta</h3>
          <p className="text-sm text-gray-500">Entregá tu auto como parte de pago y actualizate fácil.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">✅</div>
          <h3 className="mb-2 text-lg font-bold text-black">Autos verificados</h3>
          <p className="text-sm text-gray-500">Cada vehículo es revisado antes de ponerse en venta.</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">📍</div>
          <h3 className="mb-2 text-lg font-bold text-black">Atención personalizada</h3>
          <p className="text-sm text-gray-500">Te asesoramos en cada paso para que elijas con confianza.</p>
        </div>
      </ScrollReveal>

    </div>
  </div>
</section>
     

      {/* SECCIÓN VEHÍCULOS */}
<section id="vehiculos" className="bg-gray-100 px-5 py-16 md:px-10 md:py-24">
  <ScrollReveal>
   <h2 className="mb-10 text-center text-3xl font-bold text-black md:mb-14 md:text-5xl">Vehículos en Stock</h2>
  </ScrollReveal>
  {autos.length === 0 ? (
    <div className="text-center py-12 text-gray-400">
      <p className="text-5xl mb-4">🚗</p>
      <p className="text-lg">Próximamente nuevos vehículos disponibles.</p>
    </div>
  ) : (
    <StockClient autos={autos} />
  )}
</section>

      {/* SECCIÓN CONTACTO */}
      <section id='contacto' className='bg-black px-5 py-16 text-white md:px-10 md:py-24'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mb-10 text-3xl font-bold md:mb-12 md:text-5xl'>Contacto</h2>
          <div className='space-y-5 text-lg text-gray-300 md:text-2xl'>
            <a href='https://www.instagram.com/alvarogervasini_automoviles' target='_blank' rel='noreferrer' className='block transition hover:text-green-400'>
              📸 Instagram: @alvarogervasini_automoviles
            </a>
            <a href='https://wa.me/59899182849' target='_blank' rel='noreferrer' className='block transition hover:text-green-400'>
              📞 Teléfono: +598 99 182 849
            </a>
            <p>📍 Sarandí Grande, Florida</p>
          </div>
          <div className='mt-12 pt-6 border-t border-gray-800'>
            <Link href='/admin' className='text-gray-600 text-xs hover:text-gray-400 transition-colors'>
              Acceso administrador
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
