'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function StockClient({ autos }) {
  const [filtroMarca, setFiltroMarca] = useState('Todas')
  const [filtroAnio, setFiltroAnio] = useState('Todos')
  const [filtroKm, setFiltroKm] = useState('Todos')
  const [filtroOrden, setFiltroOrden] = useState('reciente')

  // Opciones únicas de marca y año extraídas de los autos
  const marcas = useMemo(() => {
    const unicas = [...new Set(autos.map(a => a.marca))].sort()
    return ['Todas', ...unicas]
  }, [autos])

  const anios = useMemo(() => {
    const unicos = [...new Set(autos.map(a => a.ano))].sort((a, b) => b - a)
    return ['Todos', ...unicos]
  }, [autos])

  const rangosKm = [
    { label: 'Todos', min: 0, max: Infinity },
    { label: 'Hasta 50.000 km', min: 0, max: 50000 },
    { label: '50.000 - 100.000 km', min: 50000, max: 100000 },
    { label: '100.000 - 200.000 km', min: 100000, max: 200000 },
    { label: 'Más de 200.000 km', min: 200000, max: Infinity },
  ]

  const autosFiltrados = useMemo(() => {
    let resultado = [...autos]

    if (filtroMarca !== 'Todas')
      resultado = resultado.filter(a => a.marca === filtroMarca)

    if (filtroAnio !== 'Todos')
      resultado = resultado.filter(a => a.ano === parseInt(filtroAnio))

    const rango = rangosKm.find(r => r.label === filtroKm)
    if (rango && filtroKm !== 'Todos')
      resultado = resultado.filter(a => a.km >= rango.min && a.km < rango.max)

    if (filtroOrden === 'precio_asc')
      resultado.sort((a, b) => (a.precio || 0) - (b.precio || 0))
    else if (filtroOrden === 'precio_desc')
      resultado.sort((a, b) => (b.precio || 0) - (a.precio || 0))
    else if (filtroOrden === 'km_asc')
      resultado.sort((a, b) => (a.km || 0) - (b.km || 0))
    else if (filtroOrden === 'anio_desc')
      resultado.sort((a, b) => b.ano - a.ano)

    return resultado
  }, [autos, filtroMarca, filtroAnio, filtroKm, filtroOrden])

  const hayFiltrosActivos = filtroMarca !== 'Todas' || filtroAnio !== 'Todos' || filtroKm !== 'Todos' || filtroOrden !== 'reciente'

  const limpiarFiltros = () => {
    setFiltroMarca('Todas')
    setFiltroAnio('Todos')
    setFiltroKm('Todos')
    setFiltroOrden('reciente')
  }

  const selectClass = "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"

  return (
    <>
      {/* FILTROS */}
      <div className="mx-auto max-w-6xl mb-10">
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
          <select value={filtroMarca} onChange={e => setFiltroMarca(e.target.value)} className={selectClass}>
            {marcas.map(m => <option key={m} value={m}>{m === 'Todas' ? '🚗 Todas las marcas' : m}</option>)}
          </select>

          <select value={filtroAnio} onChange={e => setFiltroAnio(e.target.value)} className={selectClass}>
            {anios.map(a => <option key={a} value={a}>{a === 'Todos' ? '📅 Todos los años' : a}</option>)}
          </select>

          <select value={filtroKm} onChange={e => setFiltroKm(e.target.value)} className={selectClass}>
            {rangosKm.map(r => <option key={r.label} value={r.label}>{r.label === 'Todos' ? '🛣 Todos los km' : r.label}</option>)}
          </select>

          <select value={filtroOrden} onChange={e => setFiltroOrden(e.target.value)} className={selectClass}>
            <option value="reciente">⬇ Más recientes</option>
            <option value="anio_desc">📅 Año: mayor a menor</option>
            <option value="precio_asc">💰 Precio: menor a mayor</option>
            <option value="precio_desc">💰 Precio: mayor a menor</option>
            <option value="km_asc">🛣 Km: menor a mayor</option>
          </select>

          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-500 shadow-sm transition hover:bg-red-100"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        <p className="mt-4 text-sm text-gray-500 text-center md:text-left">
          {autosFiltrados.length === autos.length
            ? `${autos.length} vehículos en stock`
            : `${autosFiltrados.length} de ${autos.length} vehículos`}
        </p>
      </div>

      {/* GRILLA */}
      {autosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No hay vehículos con esos filtros.</p>
          <button onClick={limpiarFiltros} className="mt-4 text-green-600 font-semibold hover:underline">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {autosFiltrados.map((auto) => (
            <article key={auto.id} className="group overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 md:hover:-translate-y-2 md:hover:scale-105">
              <div className="relative h-44 w-full overflow-hidden bg-gray-200">
                {auto.imagenes && auto.imagenes[0] ? (
                  <Image
                    src={auto.imagenes[0]}
                    alt={auto.marca + " " + auto.modelo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🚗</div>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">{auto.ano}</span>
                {auto.nuevo_ingreso && (
                  <span className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">Nuevo ingreso</span>
                )}
              </div>
              <div className="flex flex-col gap-3 p-5 md:p-6">
                <h3 className="text-xl font-bold text-black md:text-2xl">{auto.marca} {auto.modelo}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>🗓 {auto.ano}</span>
                  <span>·</span>
                  <span>🛣 {auto.km?.toLocaleString()} km</span>
                </div>
                <p className="text-lg font-extrabold text-green-600 md:text-xl">
                  {auto.precio ? "USD " + auto.precio.toLocaleString() : "Consultar precio"}
                </p>
                <Link href={"/vehiculos/" + auto.id}
                  className="mt-2 block w-full rounded-2xl bg-green-600 py-3 text-center text-base font-bold text-white transition hover:scale-105 hover:bg-green-700">
                  Ver vehículo →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}