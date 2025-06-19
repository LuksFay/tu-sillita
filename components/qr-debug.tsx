"use client"

import { useState, useEffect } from "react"
import { QRCodeComponent } from "./qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QRDebugProps {
  value: string
  label?: string
}

export function QRDebug({ value, label = "QR Debug" }: QRDebugProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [qrInfo, setQrInfo] = useState({
    length: 0,
    type: "",
    isUrl: false,
    isUuid: false,
  })

  useEffect(() => {
    const isUrl = value.startsWith("http://") || value.startsWith("https://")
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

    let type = "texto"
    if (isUrl) type = "url"
    else if (isUuid) type = "uuid"
    else if (value.includes("-")) type = "token"

    setQrInfo({
      length: value.length,
      type,
      isUrl,
      isUuid,
    })
  }, [value])

  if (!showDetails) {
    return (
      <div className="relative">
        <QRCodeComponent value={value} size={100} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(true)}
          className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-0 text-xs"
        >
          ?
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          {label}
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)} className="h-6 w-6 p-0">
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <QRCodeComponent value={value} size={120} />
        </div>

        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Tipo:</span>
            <span className="font-medium">{qrInfo.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Longitud:</span>
            <span className="font-medium">{qrInfo.length} chars</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Es URL:</span>
            <span className="font-medium">{qrInfo.isUrl ? "✅" : "❌"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Es UUID:</span>
            <span className="font-medium">{qrInfo.isUuid ? "✅" : "❌"}</span>
          </div>
        </div>

        <div className="text-xs bg-gray-50 p-2 rounded break-all">
          <strong>Valor:</strong> {value}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(value)}
            className="flex-1 text-xs"
          >
            Copiar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Abrir en nueva pestaña si es URL
              if (qrInfo.isUrl) {
                window.open(value, "_blank")
              }
            }}
            disabled={!qrInfo.isUrl}
            className="flex-1 text-xs"
          >
            Abrir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
