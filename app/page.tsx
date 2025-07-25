import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Users, Building, Scan, Wifi } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu Sillita</h1>
          <p className="text-gray-600">Sistema de alquiler de sillas</p>
          <p className="text-xs text-gray-500 mt-1">Conectado a tusillitaapi.arcadeestudio.com.br</p>
        </div>

        <div className="space-y-4">
          {/* Test de Conexión - NUEVO */}
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center">
              <Wifi className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-green-800">Test de Conexión</CardTitle>
              <CardDescription>Verificar que la API funciona correctamente</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test-connection">
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  Probar Conexión
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Escaneo QR - Función principal */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center">
              <Scan className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-blue-800">Escanear QR</CardTitle>
              <CardDescription>Escanea códigos QR para entregar o devolver sillas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/escaneo">
                <Button className="w-full" size="lg">
                  Abrir Escáner
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Crear Reserva */}
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle>Nueva Reserva</CardTitle>
              <CardDescription>Crear reserva de sillas para pasajero</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reserva/nueva">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Crear Reserva
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Panel Admin */}
          <Card>
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <CardTitle>Panel de Admin</CardTitle>
              <CardDescription>Gestionar coordinadores, hoteles y configuración</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Acceder
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <Link href="/admin/coordinadores" className="block text-center">
                <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <p className="text-sm font-medium">Coordinadores</p>
              </Link>
            </Card>

            <Card className="p-4">
              <Link href="/admin/hoteles" className="block text-center">
                <Building className="h-8 w-8 mx-auto text-green-500 mb-2" />
                <p className="text-sm font-medium">Hoteles</p>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
