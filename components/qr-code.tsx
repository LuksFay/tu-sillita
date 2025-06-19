"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

interface QRCodeComponentProps {
  value: string
  size?: number
  className?: string
  level?: "L" | "M" | "Q" | "H"
  margin?: number
}

export function QRCodeComponent({ value, size = 200, className = "", level = "M", margin = 2 }: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) {
        setError("No se puede generar el QR")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: margin,
          errorCorrectionLevel: level,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error generando QR:", err)
        setError("Error al generar código QR")
        setIsLoading(false)
      }
    }

    generateQR()
  }, [value, size, level, margin])

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center text-gray-500 text-sm">
          <p>❌</p>
          <p>Error QR</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center text-gray-400 text-sm">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
          <p>Generando QR...</p>
        </div>
      </div>
    )
  }

  return <canvas ref={canvasRef} className={className} />
}

// Componente alternativo para mostrar QR como imagen base64
export function QRCodeImage({ value, size = 200, className = "", level = "M" }: QRCodeComponentProps) {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      if (!value) {
        setError("Valor requerido para generar QR")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const dataURL = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          errorCorrectionLevel: level,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })

        setQrDataURL(dataURL)
        setIsLoading(false)
      } catch (err) {
        console.error("Error generando QR:", err)
        setError("Error al generar código QR")
        setIsLoading(false)
      }
    }

    generateQR()
  }, [value, size, level])

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 border-2 border-dashed border-red-300 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center text-red-500 text-sm">
          <p>❌</p>
          <p>Error QR</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 border border-gray-200 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center text-gray-400 text-sm">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <p>Generando...</p>
        </div>
      </div>
    )
  }

  return (
    <img src={qrDataURL || ""} alt={`QR Code: ${value}`} className={className} style={{ width: size, height: size }} />
  )
}
