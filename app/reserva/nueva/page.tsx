"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { coordinadorApi, hotelApi, paxApi } from "@/lib/api"
import { toast } from "sonner"
import { QRCodeComponent } from "@/components/qr-code"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Coordinador, Hotel, Pax } from "@/types"

export default function NuevaReservaPage() {
  const [coordinadores, setCoordinadores] = useState<Coordinador[]>([])
  const [hoteles, setHoteles] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reservaCreada, setReservaCreada] = useState<Pax | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    hotel_id: "",
    coordinador_id: "",
    cantidad_sillas: 1,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [coordResponse, hotelesResponse] = await Promise.all([coordinadorApi.getAll(), hotelApi.getAll()])

      setCoordinadores(coordResponse.data)
      setHoteles(hotelesResponse.data)
    } catch (error) {
      toast.error("Error al cargar los datos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.hotel_id || !formData.coordinador_id) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setSubmitting(true)
    try {
      const response = await paxApi.create({
        nombre: formData.nombre,
        hotel_id: formData.hotel_id,
        coordinador_id: formData.coordinador_id,
        cantidad_sillas: formData.cantidad_sillas,
      })

      setReservaCreada(response.data)
      toast.success("¡Reserva creada exitosamente!")
    } catch (error) {
      toast.error("Error al crear la reserva")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (reservaCreada) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-green-600">¡Reserva Confirmada!</CardTitle>
              <CardDescription>Código QR para retirar las sillas</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex justify-center">
                <QRCodeComponent value={reservaCreada.qr_code} size={200} />
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Nombre:</strong> {reservaCreada.nombre}
                </p>
                <p>
                  <strong>Hotel:</strong> {reservaCreada.hotel?.nombre}
                </p>
                <p>
                  <strong>Sillas:</strong> {reservaCreada.cantidad_sillas}
                </p>
                <p>
                  <strong>Coordinador:</strong> {reservaCreada.coordinador?.nombre}
                </p>
                <p>
                  <strong>Estado:</strong> {reservaCreada.estado}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">Instrucciones:</p>
                <p>1. Guarda este QR en tu teléfono</p>
                <p>2. Muéstralo al momento de retirar las sillas</p>
                <p>3. También lo necesitarás para la devolución</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setReservaCreada(null)
                    setFormData({ nombre: "", hotel_id: "", coordinador_id: "", cantidad_sillas: 1 })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Nueva Reserva
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full">Ir al Inicio</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header con botón volver */}
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nueva Reserva</CardTitle>
            <CardDescription>Crear reserva de sillas para un pasajero</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Pasajero *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="coordinador">Coordinador *</Label>
                <Select
                  value={formData.coordinador_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, coordinador_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un coordinador" />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinadores.map((coord) => (
                      <SelectItem key={coord.id} value={coord.id}>
                        {coord.nombre} - {coord.empresa?.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hotel">Hotel *</Label>
                <Select
                  value={formData.hotel_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, hotel_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hoteles.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cantidad">Cantidad de sillas</Label>
                <Select
                  value={formData.cantidad_sillas.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, cantidad_sillas: Number.parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "silla" : "sillas"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={submitting} size="lg">
                {submitting ? "Creando reserva..." : "Crear Reserva"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
