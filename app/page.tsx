import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu Sillita</h1>
          <p className="text-gray-600">Sistema de alquiler de sillas</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="text-center">
              <QrCode className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Escanear QR</CardTitle>
              <CardDescription>Escanea el código QR para entregar o devolver sillas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/escaneo">
                <Button className="w-full" size="lg">
                  Abrir Escáner
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle>Panel de Admin</CardTitle>
              <CardDescription>Gestionar coordinadores, hoteles y reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button variant="outline" className="w-full" size="lg">
                  Acceder
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <QrCode className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <CardTitle>Probar QR</CardTitle>
              <CardDescription>Verificar generación de códigos QR</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/test-qr">
                <Button variant="outline" className="w-full" size="lg">
                  Probar QR
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
