import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { extname, join } from 'path'

const SUPABASE_URL = 'https://ufnbgyfrwnmmfqpxqhdm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbmJneWZyd25tbWZxcHhxaGRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY3OTg5MCwiZXhwIjoyMDk2MjU1ODkwfQ.04GtTKczFG2kCy7K0lXDvmHS3NxbpLYm-AK-uVmgh1Y'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CARPETA = 'C:/Users/Dell/Downloads'

const MAPEO = {
  'Montana': 'chevrolet-montana',
  'S10': 'chevrolet-s10',
  'Spark': 'chevrolet-spark',
  'Fiat Freedom': 'fiat-freedom',
  'Fiat Mobi': 'fiat-mobi',
  'Fiat Strada Trekking': 'fiat-strada-trekking',
  'Fiat Strada Working': 'fiat-strada-working',
  'Hyundai': 'hyundai-hb20',
  'suran': 'suran',
  'Celerio': 'suzuki-celerio',
}

async function subirFotos() {
  for (const [prefijo, autoId] of Object.entries(MAPEO)) {
    const archivos = readdirSync(CARPETA).filter(f =>
      f.startsWith(prefijo) && ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase())
    )

    const urls = []

    for (const archivo of archivos) {
      const ruta = join(CARPETA, archivo)
      const buffer = readFileSync(ruta)
      const nombreStorage = `${autoId}/${archivo}`

      const { error } = await supabase.storage
        .from('autos-imagenes')
        .upload(nombreStorage, buffer, { contentType: 'image/jpeg', upsert: true })

      if (error) {
        console.log(`❌ Error subiendo ${archivo}:`, error.message)
        continue
      }

      const { data } = supabase.storage
        .from('autos-imagenes')
        .getPublicUrl(nombreStorage)

      urls.push(data.publicUrl)
      console.log(`✅ Subida: ${archivo}`)
    }

    if (urls.length > 0) {
      await supabase.from('autos').update({ imagenes: urls }).eq('id', autoId)
      console.log(`📸 ${autoId} actualizado con ${urls.length} fotos\n`)
    }
  }

  console.log('🎉 ¡Listo! Todas las fotos subidas.')
}

subirFotos()