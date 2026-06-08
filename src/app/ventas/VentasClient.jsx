'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function VentasClient() {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [ventaAmpliada, setVentaAmpliada] = useState(null)

  useEffect(() => {
    async function cargarVentas() {
      const { data } = await supabase
        .from('ventas')
        .select('*')
        .eq('visible', true)
        .order('fecha_compra', { ascending: false })
      setVentas(data || [])
      setCargando(false)
    }
    cargarVentas()
  }, [])

  function formatearFecha(fecha) {
    if (!fecha) return ''
    const d = new Date(fecha + 'T00:00:00')
    return d.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-5 py-5 bg-black text-white md:px-10 md:py-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-wide md:text-3xl">Alvaro Gervasini</span>
          <span className="text-xs font-semibold tracking-[0.2em] text-green-400 uppercase md:text-sm">Automóviles</span>
        </Link>
        <div className="flex gap-4 text-sm font-medium md:gap-8 md:text-lg">
          <Link href="/#inicio" className="transition hover:text-green-400">Inicio</Link>
          <Link href="/#vehiculos" className="transition hover:text-green-400">Vehículos</Link>
          <Link href="/resenas" className="transition hover:text-green-400">Reseñas</Link>
          <Link href="/ventas" className="text-green-400 font-semibold">Ventas</Link>
          <Link href="/#contacto" className="transition hover:text-green-400">Contacto</Link>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-100">
        {/* HEADER */}
        <div className="bg-black text-white px-5 py-16 md:px-10 md:py-20 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl mb-4">
            Ya encontraron su <span className="text-green-400">vehículo</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Clientes que confiaron en nosotros y se fueron manejando su nuevo auto.
          </p>
        </div>

        {/* GALERÍA */}
        <section className="max-w-6xl mx-auto px-5 py-16 md:px-10">
          {cargando ? (
            <div className="text-center py-20 text-gray-400 text-lg">Cargando...</div>
          ) : ventas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🚗</p>
              <p className="text-lg font-medium">Próximamente las primeras ventas publicadas.</p>
              <Link href="/#vehiculos" className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl transition-colors">
                Ver vehículos disponibles →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ventas.map((venta) => (
                <article key={venta.id}
                  onClick={() => setVentaAmpliada(venta)}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                    {venta.foto_url ? (
                      <img
                        src={venta.foto_url}
                        alt={venta.auto_descripcion}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🚗</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Vendido
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900">{venta.auto_descripcion}</h3>
                    {venta.cliente_nombre && (
                      <p className="text-sm text-gray-500 mt-1">👤 {venta.cliente_nombre}</p>
                    )}
                    {venta.fecha_compra && (
                      <p className="text-xs text-gray-400 mt-1 capitalize">📅 {formatearFecha(venta.fecha_compra)}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        {ventas.length > 0 && (
          <div className="text-center pb-20 px-5">
            <p className="text-gray-500 mb-4">¿Querés ser el próximo?</p>
            <a
              href="https://wa.me/59899182849"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg hover:scale-105"
            >
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </main>

      {/* MODAL foto ampliada */}
      {ventaAmpliada && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setVentaAmpliada(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {ventaAmpliada.foto_url && (
              <img src={ventaAmpliada.foto_url} alt={ventaAmpliada.auto_descripcion} className="w-full max-h-80 object-cover" />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{ventaAmpliada.auto_descripcion}</h3>
              {ventaAmpliada.cliente_nombre && (
                <p className="text-gray-600 mt-2">👤 {ventaAmpliada.cliente_nombre}</p>
              )}
              {ventaAmpliada.fecha_compra && (
                <p className="text-gray-400 text-sm mt-1 capitalize">📅 {formatearFecha(ventaAmpliada.fecha_compra)}</p>
              )}
              <button
                onClick={() => setVentaAmpliada(null)}
                className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
