"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { coordinadorApi, hotelApi, pasajeroApi } from "@/lib/api"
import { toast } from "sonner"
import { QRCodeComponent } from "@/components/qr-code"
import type { Coordinador, Hotel, Pasajero } from "@/types"

export default function ReservaPage() {
  const params = useParams()
  const token = params.token as string

  const [coordinador, setCoordinador] = useState<Coordinador | null>(null)
  const [hoteles, setHoteles] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reservaCreada, setReservaCreada] = useState<Pasajero | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    hotel_id: "",
    cantidad_sillas: 1,
  })

  useEffect(() => {
    loadData()
  }, [token])

  const loadData = async () => {
    try {
      const [coordResponse, hotelesResponse] = await Promise.all([coordinadorApi.getByToken(token), hotelApi.getAll()])

      setCoordinador(coordResponse.data)
      setHoteles(hotelesResponse.data)
    } catch (error) {
      toast.error("Código QR inválido o expirado")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.hotel_id) {
      toast.error("Por favor selecciona un hotel")
      return
    }

    setSubmitting(true)
    try {
      const response = await pasajeroApi.create({
        ...formData,
        coordinador_token: token,
      })

      setReservaCreada(response.data)
      toast.success("¡Reserva creada exitosamente!")
    } catch (error) {
      toast.error("Error al crear la reserva")
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

  if (!coordinador) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center pt-6">
            <p className="text-red-600 mb-4">Código QR inválido o expirado</p>
            <Button onClick={() => window.history.back()}>Volver</Button>
          </CardContent>
        </Card>
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
              <CardDescription>Tu código QR personal para retirar las sillas</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex justify-center">
                <QRCodeComponent value={reservaCreada.qr_token} size={200} />
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Nombre:</strong> {reservaCreada.nombre || "Sin nombre"}
                </p>
                <p>
                  <strong>Hotel:</strong> {reservaCreada.hotel?.nombre}
                </p>
                <p>
                  <strong>Sillas:</strong> {reservaCreada.cantidad_sillas}
                </p>
                <p>
                  <strong>Coordinador:</strong> {coordinador.nombre}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">Instrucciones:</p>
                <p>1. Guarda este QR en tu teléfono</p>
                <p>2. Muéstralo al momento de retirar las sillas</p>
                <p>3. También lo necesitarás para la devolución</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Reservar Sillas</CardTitle>
            <CardDescription>
              Coordinador: {coordinador.nombre} - {coordinador.empresa}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre (opcional)</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Tu nombre o pseudónimo"
                />
              </div>

              <div>
                <Label htmlFor="hotel">Hotel *</Label>
                <Select
                  value={formData.hotel_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, hotel_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu hotel" />
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
