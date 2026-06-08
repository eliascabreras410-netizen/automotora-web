'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminClient() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [tab, setTab] = useState('resenas')
  const [resenas, setResenas] = useState([])
  const [autos, setAutos] = useState([])
  const [ventas, setVentas] = useState([])
  const [mensajeExito, setMensajeExito] = useState('')

  // Form autos
  const [formAuto, setFormAuto] = useState({
    id: '', marca: '', modelo: '', ano: '', km: '', motor: '',
    transmision: '', combustible: '', precio: '', nuevo_ingreso: false,
    especificaciones: '', beneficios: ''
  })
  const [imagenesSubidas, setImagenesSubidas] = useState([])
  const [subiendoImagenes, setSubiendoImagenes] = useState(false)
  const [editandoAuto, setEditandoAuto] = useState(null)
  const [arrastrandoOver, setArrastrandoOver] = useState(false)
  const inputImagenRef = useRef(null)

  // Form ventas
  const [formVenta, setFormVenta] = useState({
    cliente_nombre: '', auto_descripcion: '', fecha_compra: '', visible: false
  })
  const [fotoVentaUrl, setFotoVentaUrl] = useState('')
  const [subiendoFotoVenta, setSubiendoFotoVenta] = useState(false)
  const [editandoVenta, setEditandoVenta] = useState(null)
  const [arrastrandoOverVenta, setArrastrandoOverVenta] = useState(false)
  const inputFotoVentaRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCargando(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  useEffect(() => {
    if (session) { cargarResenas(); cargarAutos(); cargarVentas() }
  }, [session])

  async function login(e) {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError('Email o contraseña incorrectos.')
  }

  async function logout() { await supabase.auth.signOut() }

  async function cargarResenas() {
    const { data } = await supabase.from('resenas').select('*').order('created_at', { ascending: false })
    setResenas(data || [])
  }

  async function aprobarResena(id) {
    await supabase.from('resenas').update({ aprobada: true }).eq('id', id)
    cargarResenas()
    mostrarExito('Reseña aprobada!')
  }

  async function rechazarResena(id) {
    await supabase.from('resenas').delete().eq('id', id)
    cargarResenas()
    mostrarExito('Reseña eliminada.')
  }

  async function cargarAutos() {
    const { data } = await supabase.from('autos').select('*').order('created_at', { ascending: false })
    setAutos(data || [])
  }

  async function cargarVentas() {
    const { data } = await supabase.from('ventas').select('*').order('fecha_compra', { ascending: false })
    setVentas(data || [])
  }

  function mostrarExito(msg) {
    setMensajeExito(msg)
    setTimeout(() => setMensajeExito(''), 3000)
  }

  // ── AUTOS: subir imágenes ──
  async function subirImagenes(files) {
    if (!files || files.length === 0) return
    setSubiendoImagenes(true)
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('autos-imagenes').upload(nombre, file)
      if (!error) {
        const { data } = supabase.storage.from('autos-imagenes').getPublicUrl(nombre)
        urls.push(data.publicUrl)
      }
    }
    setImagenesSubidas(prev => [...prev, ...urls])
    setSubiendoImagenes(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setArrastrandoOver(false)
    subirImagenes(Array.from(e.dataTransfer.files))
  }

  function eliminarImagen(url) {
    setImagenesSubidas(prev => prev.filter(u => u !== url))
  }

  function editarAuto(auto) {
    setEditandoAuto(auto.id)
    setFormAuto({
      id: auto.id,
      marca: auto.marca || '',
      modelo: auto.modelo || '',
      ano: auto.ano || '',
      km: auto.km || '',
      motor: auto.motor || '',
      transmision: auto.transmision || '',
      combustible: auto.combustible || '',
      precio: auto.precio || '',
      nuevo_ingreso: auto.nuevo_ingreso || false,
      especificaciones: (auto.especificaciones || []).join(', '),
      beneficios: (auto.beneficios || []).join(', '),
    })
    setImagenesSubidas(auto.imagenes || [])
    setTab('form')
  }

  function nuevoAuto() {
    setEditandoAuto(null)
    setFormAuto({
      id: '', marca: '', modelo: '', ano: '', km: '', motor: '',
      transmision: '', combustible: '', precio: '', nuevo_ingreso: false,
      especificaciones: '', beneficios: ''
    })
    setImagenesSubidas([])
    setTab('form')
  }

  async function guardarAuto(e) {
    e.preventDefault()
    const datos = {
      marca: formAuto.marca,
      modelo: formAuto.modelo,
      ano: parseInt(formAuto.ano),
      km: parseInt(formAuto.km),
      motor: formAuto.motor,
      transmision: formAuto.transmision,
      combustible: formAuto.combustible,
      precio: formAuto.precio ? parseInt(formAuto.precio) : null,
      nuevo_ingreso: formAuto.nuevo_ingreso,
      especificaciones: formAuto.especificaciones.split(',').map(s => s.trim()).filter(Boolean),
      beneficios: formAuto.beneficios.split(',').map(s => s.trim()).filter(Boolean),
      imagenes: imagenesSubidas,
      id: editandoAuto || (formAuto.marca + '-' + formAuto.modelo).toLowerCase().replace(/ /g, '-')
    }
    if (editandoAuto) {
      await supabase.from('autos').update(datos).eq('id', editandoAuto)
      mostrarExito('Auto actualizado!')
    } else {
      await supabase.from('autos').insert(datos)
      mostrarExito('Auto agregado!')
    }
    cargarAutos()
    setTab('autos')
  }

  async function eliminarAuto(id) {
    if (!confirm('¿Seguro que querés eliminar este auto?')) return
    await supabase.from('autos').delete().eq('id', id)
    cargarAutos()
    mostrarExito('Auto eliminado.')
  }

  // ── VENTAS ──
  async function subirFotoVenta(files) {
    if (!files || files.length === 0) return
    setSubiendoFotoVenta(true)
    const file = files[0]
    const ext = file.name.split('.').pop()
    const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('ventas-imagenes').upload(nombre, file)
    if (!error) {
      const { data } = supabase.storage.from('ventas-imagenes').getPublicUrl(nombre)
      setFotoVentaUrl(data.publicUrl)
    }
    setSubiendoFotoVenta(false)
  }

  function handleDropVenta(e) {
    e.preventDefault()
    setArrastrandoOverVenta(false)
    subirFotoVenta(Array.from(e.dataTransfer.files))
  }

  function nuevaVenta() {
    setEditandoVenta(null)
    setFormVenta({ cliente_nombre: '', auto_descripcion: '', fecha_compra: '', visible: false })
    setFotoVentaUrl('')
    setTab('form-venta')
  }

  function editarVenta(venta) {
    setEditandoVenta(venta.id)
    setFormVenta({
      cliente_nombre: venta.cliente_nombre || '',
      auto_descripcion: venta.auto_descripcion || '',
      fecha_compra: venta.fecha_compra || '',
      visible: venta.visible || false,
    })
    setFotoVentaUrl(venta.foto_url || '')
    setTab('form-venta')
  }

  async function guardarVenta(e) {
    e.preventDefault()
    const datos = {
      cliente_nombre: formVenta.cliente_nombre || null,
      auto_descripcion: formVenta.auto_descripcion,
      fecha_compra: formVenta.fecha_compra,
      foto_url: fotoVentaUrl,
      visible: formVenta.visible,
    }
    if (editandoVenta) {
      await supabase.from('ventas').update(datos).eq('id', editandoVenta)
      mostrarExito('Venta actualizada!')
    } else {
      await supabase.from('ventas').insert(datos)
      mostrarExito('Venta agregada!')
    }
    cargarVentas()
    setTab('ventas')
  }

  async function toggleVisibleVenta(venta) {
    await supabase.from('ventas').update({ visible: !venta.visible }).eq('id', venta.id)
    cargarVentas()
    mostrarExito(venta.visible ? 'Venta ocultada.' : 'Venta publicada!')
  }

  async function eliminarVenta(id) {
    if (!confirm('¿Seguro que querés eliminar esta venta?')) return
    await supabase.from('ventas').delete().eq('id', id)
    cargarVentas()
    mostrarExito('Venta eliminada.')
  }

  function formatearFecha(fecha) {
    if (!fecha) return ''
    const d = new Date(fecha + 'T00:00:00')
    return d.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })
  }

  if (cargando) return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>

  if (!session) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel de administración</h1>
        <p className="text-gray-500 mb-6 text-sm">Alvaro Gervasini Automóviles</p>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Ingresar
          </button>
        </form>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Panel de administración</h1>
          <p className="text-gray-400 text-sm">Alvaro Gervasini Automóviles</p>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Cerrar sesión</button>
      </div>

      {mensajeExito && (
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ {mensajeExito}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setTab('resenas')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === 'resenas' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Reseñas {resenas.filter(r => !r.aprobada).length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{resenas.filter(r => !r.aprobada).length}</span>}
          </button>
          <button onClick={() => setTab('autos')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === 'autos' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Autos en stock ({autos.length})
          </button>
          <button onClick={() => setTab('ventas')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === 'ventas' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Ventas realizadas ({ventas.length})
          </button>
        </div>

        {/* ── TAB RESEÑAS ── */}
        {tab === 'resenas' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Reseñas pendientes de aprobación</h2>
            {resenas.filter(r => !r.aprobada).length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">✓</p>
                <p>No hay reseñas pendientes.</p>
              </div>
            )}
            {resenas.filter(r => !r.aprobada).map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{r.nombre}</p>
                    <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-yellow-400">{'★'.repeat(r.estrellas)}{'☆'.repeat(5 - r.estrellas)}</div>
                </div>
                <p className="text-gray-700 text-sm">{r.mensaje}</p>
                <div className="flex gap-2">
                  <button onClick={() => aprobarResena(r.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors">✓ Aprobar</button>
                  <button onClick={() => rechazarResena(r.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2 rounded-xl transition-colors">✗ Eliminar</button>
                </div>
              </div>
            ))}
            {resenas.filter(r => r.aprobada).length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mt-8">Reseñas publicadas</h2>
                {resenas.filter(r => r.aprobada).map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 opacity-70">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{r.nombre}</p>
                        <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-400">{'★'.repeat(r.estrellas)}{'☆'.repeat(5 - r.estrellas)}</div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Publicada</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{r.mensaje}</p>
                    <button onClick={() => rechazarResena(r.id)} className="self-end text-xs text-red-400 hover:text-red-600">Eliminar</button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── TAB AUTOS ── */}
        {tab === 'autos' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Autos en stock</h2>
              <button onClick={nuevoAuto} className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">+ Agregar auto</button>
            </div>
            {autos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🚗</p>
                <p>No hay autos cargados todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {autos.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{a.marca} {a.modelo}</p>
                      <p className="text-sm text-gray-400">{a.ano} · {a.km?.toLocaleString()} km</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editarAuto(a)} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl transition-colors">Editar</button>
                      <button onClick={() => eliminarAuto(a.id)} className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl transition-colors">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB VENTAS ── */}
        {tab === 'ventas' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Ventas realizadas</h2>
              <button onClick={nuevaVenta} className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">+ Agregar venta</button>
            </div>
            {ventas.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🏆</p>
                <p>No hay ventas cargadas todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ventas.map(v => (
                  <div key={v.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
                    {v.foto_url && (
                      <img src={v.foto_url} alt={v.auto_descripcion} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">{v.auto_descripcion}</p>
                      <p className="text-sm text-gray-400">
                        {v.cliente_nombre ? `👤 ${v.cliente_nombre} · ` : ''}
                        {v.fecha_compra ? `📅 ${formatearFecha(v.fecha_compra)}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleVisibleVenta(v)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${v.visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        {v.visible ? '✓ Visible' : 'Oculta'}
                      </button>
                      <button onClick={() => editarVenta(v)} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl transition-colors">Editar</button>
                      <button onClick={() => eliminarVenta(v.id)} className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl transition-colors">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FORM AUTOS ── */}
        {tab === 'form' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{editandoAuto ? 'Editar auto' : 'Agregar nuevo auto'}</h2>
            <form onSubmit={guardarAuto} className="space-y-4 bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input value={formAuto.marca} onChange={e => setFormAuto({...formAuto, marca: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Ej: Volkswagen" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input value={formAuto.modelo} onChange={e => setFormAuto({...formAuto, modelo: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Ej: Suran" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <input value={formAuto.ano} onChange={e => setFormAuto({...formAuto, ano: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Ej: 2019" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros</label>
                  <input value={formAuto.km} onChange={e => setFormAuto({...formAuto, km: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Ej: 80000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motor</label>
                  <input value={formAuto.motor} onChange={e => setFormAuto({...formAuto, motor: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Ej: 1.6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
                  <input value={formAuto.transmision} onChange={e => setFormAuto({...formAuto, transmision: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Manual / Automático" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
                  <input value={formAuto.combustible} onChange={e => setFormAuto({...formAuto, combustible: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Nafta / Diesel / GNC" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio USD (opcional)</label>
                  <input value={formAuto.precio} onChange={e => setFormAuto({...formAuto, precio: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Vacío = Consultar precio" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones (separadas por coma)</label>
                <input value={formAuto.especificaciones} onChange={e => setFormAuto({...formAuto, especificaciones: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Aire acondicionado, Vidrio eléctrico" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficios (separados por coma)</label>
                <input value={formAuto.beneficios} onChange={e => setFormAuto({...formAuto, beneficios: e.target.value})} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Financiación disponible, Acepta permuta" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fotos del auto</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setArrastrandoOver(true) }}
                  onDragLeave={() => setArrastrandoOver(false)}
                  onClick={() => inputImagenRef.current.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${arrastrandoOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}`}
                >
                  <p className="text-3xl mb-2">📸</p>
                  <p className="text-sm font-medium text-gray-700">Arrastrá fotos acá o tocá para seleccionar</p>
                  <p className="text-xs text-gray-400 mt-1">Podés subir varias fotos a la vez</p>
                  <input ref={inputImagenRef} type="file" accept="image/*" multiple className="hidden" onChange={e => subirImagenes(Array.from(e.target.files))} />
                </div>
                {subiendoImagenes && <p className="text-sm text-green-600 mt-2">Subiendo imágenes...</p>}
                {imagenesSubidas.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {imagenesSubidas.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt="" className="w-full h-24 object-cover rounded-xl" />
                        <button type="button" onClick={() => eliminarImagen(url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="nuevo_ingreso" checked={formAuto.nuevo_ingreso} onChange={e => setFormAuto({...formAuto, nuevo_ingreso: e.target.checked})} className="w-4 h-4 accent-green-500" />
                <label htmlFor="nuevo_ingreso" className="text-sm font-medium text-gray-700">Marcar como nuevo ingreso</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors">
                  {editandoAuto ? 'Guardar cambios' : 'Agregar auto'}
                </button>
                <button type="button" onClick={() => setTab('autos')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── FORM VENTAS ── */}
        {tab === 'form-venta' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{editandoVenta ? 'Editar venta' : 'Agregar nueva venta'}</h2>
            <form onSubmit={guardarVenta} className="space-y-4 bg-white rounded-2xl border border-gray-200 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto vendido <span className="text-red-400">*</span></label>
                <input
                  value={formVenta.auto_descripcion}
                  onChange={e => setFormVenta({...formVenta, auto_descripcion: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Ej: Honda Fit 2019"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente <span className="text-gray-400 font-normal">(opcional)</span></label>
                <input
                  value={formVenta.cliente_nombre}
                  onChange={e => setFormVenta({...formVenta, cliente_nombre: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de compra <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  value={formVenta.fecha_compra}
                  onChange={e => setFormVenta({...formVenta, fecha_compra: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto del cliente con el auto <span className="text-red-400">*</span></label>
                <div
                  onDrop={handleDropVenta}
                  onDragOver={e => { e.preventDefault(); setArrastrandoOverVenta(true) }}
                  onDragLeave={() => setArrastrandoOverVenta(false)}
                  onClick={() => !fotoVentaUrl && inputFotoVentaRef.current.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${fotoVentaUrl ? 'border-green-400 bg-green-50 cursor-default' : 'cursor-pointer border-gray-300 hover:border-green-400 hover:bg-gray-50'} ${arrastrandoOverVenta ? 'border-green-400 bg-green-50' : ''}`}
                >
                  {fotoVentaUrl ? (
                    <div className="relative">
                      <img src={fotoVentaUrl} alt="Foto venta" className="mx-auto max-h-48 rounded-xl object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFotoVentaUrl('') }}
                        className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        ✕ Cambiar foto
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">📸</p>
                      <p className="text-sm font-medium text-gray-700">Arrastrá la foto acá o tocá para seleccionar</p>
                      <p className="text-xs text-gray-400 mt-1">Solo una foto por venta</p>
                    </>
                  )}
                  <input ref={inputFotoVentaRef} type="file" accept="image/*" className="hidden" onChange={e => subirFotoVenta(Array.from(e.target.files))} />
                </div>
                {subiendoFotoVenta && <p className="text-sm text-green-600 mt-2">Subiendo foto...</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="visible_venta" checked={formVenta.visible} onChange={e => setFormVenta({...formVenta, visible: e.target.checked})} className="w-4 h-4 accent-green-500" />
                <label htmlFor="visible_venta" className="text-sm font-medium text-gray-700">Publicar en la página ahora</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors">
                  {editandoVenta ? 'Guardar cambios' : 'Agregar venta'}
                </button>
                <button type="button" onClick={() => setTab('ventas')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
