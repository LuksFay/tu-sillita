"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeComponent, QRCodeImage } from "@/components/qr-code"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function TestQRPage() {
  const [testValue, setTestValue] = useState("https://tu-sillita.vercel.app/reserva/test-token-123")
  const [qrSize, setQrSize] = useState(200)

  // Ejemplos de tokens para probar
  const exampleTokens = [
    {
      label: "Token Coordinador",
      value: "coord-abc123-def456-ghi789",
      type: "coordinador",
    },
    {
      label: "Token Pasajero",
      value: "pass-xyz789-uvw456-rst123",
      type: "pasajero",
    },
    {
      label: "URL Reserva",
      value: "https://tu-sillita.vercel.app/reserva/coord-abc123",
      type: "url",
    },
    {
      label: "Texto Simple",
      value: "Hola mundo - Prueba QR",
      type: "texto",
    },
  ]

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast.success("Token copiado al portapapeles")
  }

  const handleDownloadQR = async (value: string) => {
    try {
      const QRCode = (await import("qrcode")).default
      const dataURL = await QRCode.toDataURL(value, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: "M",
      })

      const link = document.createElement("a")
      link.download = `qr-${Date.now()}.png`
      link.href = dataURL
      link.click()

      toast.success("QR descargado exitosamente")
    } catch (error) {
      toast.error("Error al descargar QR")
    }
  }

  const generateRandomToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setTestValue(`token-${result}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verificación de Códigos QR</h1>
          <p className="text-gray-600">Prueba la generación de códigos QR con diferentes valores y tamaños</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Control */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Prueba</CardTitle>
              <CardDescription>Personaliza el valor y tamaño del QR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testValue">Valor para el QR</Label>
                <div className="flex gap-2">
                  <Input
                    id="testValue"
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                    placeholder="Ingresa el texto o token"
                  />
                  <Button variant="outline" size="sm" onClick={generateRandomToken}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="qrSize">Tamaño del QR: {qrSize}px</Label>
                <input
                  id="qrSize"
                  type="range"
                  min="100"
                  max="400"
                  step="50"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopyToken(testValue)} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadQR(testValue)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visualización del QR */}
          <Card>
            <CardHeader>
              <CardTitle>QR Generado</CardTitle>
              <CardDescription>Vista previa del código QR</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <QRCodeComponent value={testValue} size={qrSize} level="M" />
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Valor:</strong> {testValue.length > 50 ? `${testValue.substring(0, 50)}...` : testValue}
                </p>
                <p>
                  <strong>Tamaño:</strong> {qrSize}x{qrSize}px
                </p>
                <p>
                  <strong>Caracteres:</strong> {testValue.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ejemplos Predefinidos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ejemplos de Tokens</CardTitle>
            <CardDescription>Prueba con diferentes tipos de valores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exampleTokens.map((example, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{example.label}</h3>
                    <Badge variant="outline">{example.type}</Badge>
                  </div>

                  <div className="text-center">
                    <QRCodeImage value={example.value} size={120} className="mx-auto" />
                  </div>

                  <div className="text-xs text-gray-500 break-all">{example.value}</div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setTestValue(example.value)} className="flex-1">
                      Usar Este
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCopyToken(example.value)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información Técnica */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium text-blue-800 mb-2">Librería Utilizada</h4>
                <p className="text-blue-600">qrcode v1.5.3</p>
                <p className="text-blue-600">Canvas + DataURL</p>
              </div>

              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium text-green-800 mb-2">Características</h4>
                <p className="text-green-600">✅ Error Correction</p>
                <p className="text-green-600">✅ Tamaño Variable</p>
                <p className="text-green-600">✅ Descarga PNG</p>
              </div>

              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-medium text-purple-800 mb-2">Compatibilidad</h4>
                <p className="text-purple-600">✅ Móviles</p>
                <p className="text-purple-600">✅ Escritorio</p>
                <p className="text-purple-600">✅ Todos los navegadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón para volver */}
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Volver a la Aplicación
          </Button>
        </div>
      </div>
    </div>
  )
}
