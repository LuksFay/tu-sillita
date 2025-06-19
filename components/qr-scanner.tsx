"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/library"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff } from "lucide-react"

interface QRScannerProps {
  onResult: (result: string) => void
  onError?: (error: string) => void
  isActive: boolean
  onToggle: () => void
}

export function QRScanner({ onResult, onError, isActive, onToggle }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>("")

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    setCodeReader(reader)

    // Obtener dispositivos de cámara
    reader
      .listVideoInputDevices()
      .then((videoDevices) => {
        setDevices(videoDevices)
        if (videoDevices.length > 0) {
          // Preferir cámara trasera si está disponible
          const backCamera = videoDevices.find((device) => device.label.toLowerCase().includes("back"))
          setSelectedDevice(backCamera?.deviceId || videoDevices[0].deviceId)
        }
      })
      .catch((err) => {
        console.error("Error obteniendo dispositivos:", err)
        onError?.("No se pudieron obtener las cámaras disponibles")
      })

    return () => {
      reader.reset()
    }
  }, [onError])

  useEffect(() => {
    if (isActive && codeReader && videoRef.current && selectedDevice) {
      startScanning()
    } else if (!isActive && codeReader) {
      stopScanning()
    }

    return () => {
      if (codeReader) {
        stopScanning()
      }
    }
  }, [isActive, codeReader, selectedDevice])

  const startScanning = async () => {
    if (!codeReader || !videoRef.current || !selectedDevice) return

    try {
      // Solicitar permisos de cámara
      await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)

      // Iniciar escaneo
      await codeReader.decodeFromVideoDevice(selectedDevice, videoRef.current, (result, error) => {
        if (result) {
          onResult(result.getText())
          // Opcional: detener el escaneo después de encontrar un código
          // stopScanning()
        }
        if (error && error.name !== "NotFoundException") {
          console.error("Error de escaneo:", error)
        }
      })
    } catch (err) {
      console.error("Error iniciando scanner:", err)
      setHasPermission(false)
      onError?.("No se pudo acceder a la cámara. Verifica los permisos.")
    }
  }

  const stopScanning = () => {
    if (codeReader) {
      codeReader.reset()
    }
  }

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      if (isActive) {
        startScanning()
      }
    } catch (err) {
      setHasPermission(false)
      onError?.("Permisos de cámara denegados")
    }
  }

  if (hasPermission === false) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <CameraOff className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 className="font-medium text-red-800 mb-2">Permisos de Cámara Requeridos</h3>
        <p className="text-red-600 text-sm mb-4">Necesitamos acceso a tu cámara para escanear códigos QR</p>
        <Button onClick={requestPermissions} variant="outline" className="bg-white">
          Permitir Cámara
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
        <video ref={videoRef} className="w-full h-full object-cover" style={{ display: isActive ? "block" : "none" }} />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p>Cámara inactiva</p>
            </div>
          </div>
        )}

        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Marco de escaneo */}
            <div className="absolute inset-4 border-2 border-white rounded-lg">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
            </div>

            {/* Línea de escaneo animada */}
            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-green-400 animate-pulse"></div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={onToggle} className="flex-1">
          {isActive ? (
            <>
              <CameraOff className="h-4 w-4 mr-2" />
              Detener Cámara
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Iniciar Cámara
            </>
          )}
        </Button>

        {devices.length > 1 && (
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            disabled={isActive}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Cámara ${device.deviceId.substring(0, 8)}`}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Apunta la cámara hacia un código QR</p>
        <p>El escaneo es automático cuando detecta un código</p>
      </div>
    </div>
  )
}
