'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Estrellas({ valor, onClick, interactiva }) {
  return (
    <div className='flex gap-1'>
      {[1,2,3,4,5].map(i => (
        <button key={i} type='button' onClick={() => interactiva && onClick(i)} className={interactiva ? 'cursor-pointer text-2xl' : 'text-xl cursor-default'}>
          <span className={i <= valor ? 'text-yellow-400' : 'text-gray-400'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function ResenasClient() {
  const [resenas, setResenas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({ nombre: '', mensaje: '', estrellas: 0 })
  const [error, setError] = useState('')

  useEffect(() => { cargarResenas() }, [])

  async function cargarResenas() {
    const { data } = await supabase.from('resenas').select('*').order('created_at', { ascending: false })
    setResenas(data || [])
    setCargando(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim()) return setError('Por favor ingresa tu nombre.')
    if (!form.mensaje.trim()) return setError('Por favor escribe tu experiencia.')
    if (form.estrellas === 0) return setError('Por favor selecciona una puntuacion.')
    setEnviando(true)
    const { error: err } = await supabase.from('resenas').insert({ nombre: form.nombre.trim(), mensaje: form.mensaje.trim(), estrellas: form.estrellas })
    setEnviando(false)
    if (err) { setError('Hubo un error al enviar. Intenta de nuevo.') }
    else { setEnviado(true); setForm({ nombre: '', mensaje: '', estrellas: 0 }) }
  }

  const promedio = resenas.length > 0 ? (resenas.reduce((a, r) => a + r.estrellas, 0) / resenas.length).toFixed(1) : null

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto px-4 py-16'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-3'>Reseñas de clientes</h1>
          <p className='text-gray-500 text-lg'>Lo que dicen quienes compraron con nosotros</p>
          {promedio && (
            <div className='mt-4 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 shadow-sm'>
              <span className='text-yellow-400 text-xl'>★</span>
              <span className='font-bold text-gray-800 text-lg'>{promedio}</span>
              <span className='text-gray-400 text-sm'>({resenas.length} reseñas)</span>
            </div>
          )}
        </div>

        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Dejá tu experiencia</h2>
          {enviado ? (
            <div className='text-center py-8'>
              <div className='text-5xl mb-4'>🎉</div>
              <p className='text-xl font-semibold text-gray-800 mb-2'>¡Gracias por tu reseña!</p>
              <p className='text-gray-500'>Será publicada una vez que la revisemos.</p>
              <button onClick={() => setEnviado(false)} className='mt-6 text-green-600 underline text-sm'>Dejar otra reseña</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tu nombre</label>
                <input type='text' placeholder='Ej: Juan Pérez' value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className='w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tu experiencia</label>
                <textarea placeholder='Contá cómo fue tu experiencia comprando con nosotros...' value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} rows={4} className='w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Puntuación</label>
                <Estrellas valor={form.estrellas} onClick={v => setForm({...form, estrellas: v})} interactiva={true} />
              </div>
              {error && <p className='text-red-500 text-sm'>{error}</p>}
              <button type='submit' disabled={enviando} className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60'>
                {enviando ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </form>
          )}
        </div>

        {cargando ? (
          <div className='text-center text-gray-400 py-12'>Cargando reseñas...</div>
        ) : resenas.length === 0 ? (
          <div className='text-center text-gray-400 py-12'>
            <div className='text-5xl mb-4'>💬</div>
            <p className='text-lg'>Todavía no hay reseñas publicadas.</p>
            <p className='text-sm mt-1'>¡Sé el primero en dejar la tuya!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {resenas.map(r => (
              <div key={r.id} className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-3'>
                <Estrellas valor={r.estrellas} interactiva={false} />
                <p className='text-gray-700 leading-relaxed flex-1'>{r.mensaje}</p>
                <div className='flex items-center gap-3 pt-2 border-t border-gray-100'>
                  <div className='w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm'>
                    {r.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800 text-sm'>{r.nombre}</p>
                    <p className='text-gray-400 text-xs'>{new Date(r.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}