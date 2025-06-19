"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { pasajeroApi } from "@/lib/api"
import { toast } from "sonner"
import { QrCode, CheckCircle, Keyboard } from "lucide-react"
import type { Pasajero } from "@/types"
import { QRCodeComponent } from "@/components/qr-code"
import { QRScanner } from "@/components/qr-scanner"

export default function EscaneoPage() {
  const [scanning, setScanning] = useState(false)
  const [pasajero, setPasajero] = useState<Pasajero | null>(null)
  const [processing, setProcessing] = useState(false)
  const [manualInput, setManualInput] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)

  const handleScanResult = async (result: string) => {
    if (!result || processing) return

    setProcessing(true)
    try {
      const response = await pasajeroApi.getByToken(result)
      setPasajero(response.data)
      setScanning(false)
      toast.success("QR escaneado correctamente")
    } catch (error) {
      toast.error("QR inválido o no encontrado")
    } finally {
      setProcessing(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleScanResult(manualInput.trim())
      setManualInput("")
      setShowManualInput(false)
    }
  }

  const handleUpdateEstado = async (nuevoEstado: "entregado" | "devuelto") => {
    if (!pasajero) return

    setProcessing(true)
    try {
      await pasajeroApi.updateEstado(pasajero.qr_token, nuevoEstado)
      setPasajero((prev) => (prev ? { ...prev, estado: nuevoEstado } : null))
      toast.success(`Estado actualizado a: ${nuevoEstado}`)
    } catch (error) {
      toast.error("Error al actualizar el estado")
    } finally {
      setProcessing(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="secondary">Pendiente</Badge>
      case "entregado":
        return (
          <Badge variant="default" className="bg-blue-600">
            Entregado
          </Badge>
        )
      case "devuelto":
        return (
          <Badge variant="default" className="bg-green-600">
            Devuelto
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="mb-4">
          <CardHeader className="text-center">
            <QrCode className="h-12 w-12 mx-auto text-blue-600 mb-2" />
            <CardTitle>Escáner QR</CardTitle>
            <CardDescription>Escanea el código del pasajero para entregar o devolver sillas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scanning && !showManualInput ? (
              <div className="space-y-2">
                <Button onClick={() => setScanning(true)} className="w-full" size="lg">
                  Abrir Escáner de Cámara
                </Button>
                <Button variant="outline" onClick={() => setShowManualInput(true)} className="w-full" size="lg">
                  <Keyboard className="h-4 w-4 mr-2" />
                  Entrada Manual
                </Button>
              </div>
            ) : showManualInput ? (
              <div className="space-y-4">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="manual-token">Token del Pasajero</Label>
                    <Input
                      id="manual-token"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Pega o escribe el token aquí"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={!manualInput.trim() || processing} className="flex-1">
                      {processing ? "Buscando..." : "Buscar Pasajero"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowManualInput(false)
                        setManualInput("")
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <QRScanner
                onResult={handleScanResult}
                onError={(error) => toast.error(error)}
                isActive={scanning}
                onToggle={() => setScanning(!scanning)}
              />
            )}

            {scanning && (
              <Button
                variant="outline"
                onClick={() => {
                  setScanning(false)
                  setShowManualInput(false)
                }}
                className="w-full"
              >
                Volver al Menú
              </Button>
            )}
          </CardContent>
        </Card>

        {pasajero && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Información del Pasajero
                {getEstadoBadge(pasajero.estado)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-600">Nombre</p>
                  <p>{pasajero.nombre || "Sin nombre"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Hotel</p>
                  <p>{pasajero.hotel?.nombre}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Sillas</p>
                  <p>{pasajero.cantidad_sillas}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Coordinador</p>
                  <p>{pasajero.coordinador?.nombre}</p>
                </div>
              </div>

              <div className="text-center">
                <QRCodeComponent value={pasajero.qr_token} size={100} />
                <p className="text-xs text-gray-500 mt-1">QR del Pasajero</p>
              </div>

              <div className="flex gap-2 pt-4">
                {pasajero.estado === "pendiente" && (
                  <Button onClick={() => handleUpdateEstado("entregado")} disabled={processing} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Entregado
                  </Button>
                )}

                {pasajero.estado === "entregado" && (
                  <Button
                    onClick={() => handleUpdateEstado("devuelto")}
                    disabled={processing}
                    variant="outline"
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Devuelto
                  </Button>
                )}

                {pasajero.estado === "devuelto" && (
                  <div className="flex-1 text-center py-2 text-green-600 font-medium">✅ Proceso Completado</div>
                )}
              </div>

              <Button variant="ghost" onClick={() => setPasajero(null)} className="w-full">
                Escanear Otro QR
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
