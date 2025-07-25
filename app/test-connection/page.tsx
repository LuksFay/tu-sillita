"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { testConnection, empresaApi, hotelApi, tiempoApi, coordinadorApi, paxApi } from "@/lib/api"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

interface TestResult {
  name: string
  status: "loading" | "success" | "error"
  message: string
  data?: any
}

export default function TestConnectionPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Conexión General", status: "loading", message: "Probando..." },
    { name: "Empresas", status: "loading", message: "Probando..." },
    { name: "Hoteles", status: "loading", message: "Probando..." },
    { name: "Tiempos", status: "loading", message: "Probando..." },
    { name: "Coordinadores", status: "loading", message: "Probando..." },
    { name: "Pax", status: "loading", message: "Probando..." },
  ])

  const runTests = async () => {
    // Reset tests
    setTests((prev) => prev.map((test) => ({ ...test, status: "loading", message: "Probando..." })))

    const testFunctions = [
      { name: "Conexión General", fn: testConnection },
      { name: "Empresas", fn: () => empresaApi.getAll() },
      { name: "Hoteles", fn: () => hotelApi.getAll() },
      { name: "Tiempos", fn: () => tiempoApi.getAll() },
      { name: "Coordinadores", fn: () => coordinadorApi.getAll() },
      { name: "Pax", fn: () => paxApi.getAll() },
    ]

    for (let i = 0; i < testFunctions.length; i++) {
      const test = testFunctions[i]

      try {
        const result = await test.fn()

        setTests((prev) =>
          prev.map((t, index) =>
            index === i
              ? {
                  ...t,
                  status: "success",
                  message: `✅ OK - ${Array.isArray(result.data) ? result.data.length : "Datos"} registros`,
                  data: result.data,
                }
              : t,
          ),
        )
      } catch (error: any) {
        setTests((prev) =>
          prev.map((t, index) =>
            index === i
              ? {
                  ...t,
                  status: "error",
                  message: `❌ Error: ${error.message}`,
                }
              : t,
          ),
        )
      }

      // Pequeña pausa entre tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "loading":
        return <Badge variant="secondary">Probando...</Badge>
      case "success":
        return <Badge className="bg-green-600">Éxito</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const allSuccess = tests.every((test) => test.status === "success")
  const hasErrors = tests.some((test) => test.status === "error")

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Test de Conexión API</h1>
            <p className="text-gray-600">Verificando conexión con tusillitaapi.arcadeestudio.com.br</p>
          </div>
          <Button onClick={runTests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        {/* Resumen */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {allSuccess && <CheckCircle className="h-5 w-5 text-green-500" />}
              {hasErrors && <XCircle className="h-5 w-5 text-red-500" />}
              Estado General
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allSuccess && (
              <div className="text-green-600">
                ✅ Todas las conexiones funcionan correctamente. La aplicación está lista para usar.
              </div>
            )}
            {hasErrors && <div className="text-red-600">❌ Hay problemas de conexión. Revisa los detalles abajo.</div>}
            {!allSuccess && !hasErrors && <div className="text-blue-600">🔄 Probando conexiones...</div>}
          </CardContent>
        </Card>

        {/* Tests individuales */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>

                {test.data && test.status === "success" && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <strong>Datos de ejemplo:</strong>
                    <pre className="mt-1 overflow-x-auto">
                      {JSON.stringify(Array.isArray(test.data) ? test.data[0] : test.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones */}
        <div className="mt-8 flex gap-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Volver al Inicio
            </Button>
          </Link>
          {allSuccess && (
            <Link href="/admin" className="flex-1">
              <Button className="w-full">Ir al Panel Admin</Button>
            </Link>
          )}
        </div>

        {/* Información técnica */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Información Técnica</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p>
              <strong>API Base:</strong> https://tusillitaapi.arcadeestudio.com.br/api
            </p>
            <p>
              <strong>Timeout:</strong> 15 segundos
            </p>
            <p>
              <strong>Nota:</strong> Los endpoints requieren "/" al final
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
