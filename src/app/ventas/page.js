import VentasClient from './VentasClient'

export const metadata = {
  title: 'Ventas realizadas | Alvaro Gervasini Automóviles',
  description: 'Clientes que ya encontraron su vehículo con nosotros.',
}

export default function VentasPage() {
  return <VentasClient />
}
