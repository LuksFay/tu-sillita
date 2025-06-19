"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { coordinadorApi, hotelApi, pasajeroApi } from "@/lib/api"
import { toast } from "sonner"
import { QRCodeComponent } from "@/components/qr-code"
import { Plus, Trash2, LogOut } from "lucide-react"
import type { Coordinador, Hotel, Pasajero } from "@/types"

export default function AdminPage() {
  const { isAuthenticated, isLoading, login, logout } = useAuth()
  const [password, setPassword] = useState("")

  const [coordinadores, setCoordinadores] = useState<Coordinador[]>([])
  const [hoteles, setHoteles] = useState<Hotel[]>([])
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([])

  const [newCoordinador, setNewCoordinador] = useState({
    nombre: "",
    empresa: "",
    fecha_inicio: "",
    fecha_fin: "",
  })

  const [newHotel, setNewHotel] = useState("")
  const [filters, setFilters] = useState({
    hotel_id: "all",
    coordinador_id: "all",
    estado: "all",
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      const [coordResponse, hotelesResponse, pasajerosResponse] = await Promise.all([
        coordinadorApi.getAll(),
        hotelApi.getAll(),
        pasajeroApi.getAll(filters),
      ])

      setCoordinadores(coordResponse.data)
      setHoteles(hotelesResponse.data)
      setPasajeros(pasajerosResponse.data)
    } catch (error) {
      toast.error("Error al cargar los datos")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      toast.success("Acceso concedido")
    } else {
      toast.error("Contraseña incorrecta")
    }
  }

  const handleCreateCoordinador = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await coordinadorApi.create(newCoordinador)
      setNewCoordinador({ nombre: "", empresa: "", fecha_inicio: "", fecha_fin: "" })
      loadData()
      toast.success("Coordinador creado exitosamente")
    } catch (error) {
      toast.error("Error al crear coordinador")
    }
  }

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHotel.trim()) return

    try {
      await hotelApi.create(newHotel)
      setNewHotel("")
      loadData()
      toast.success("Hotel creado exitosamente")
    } catch (error) {
      toast.error("Error al crear hotel")
    }
  }

  const handleDeleteCoordinador = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este coordinador?")) return

    try {
      await coordinadorApi.delete(id)
      loadData()
      toast.success("Coordinador eliminado")
    } catch (error) {
      toast.error("Error al eliminar coordinador")
    }
  }

  const handleDeleteHotel = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este hotel?")) return

    try {
      await hotelApi.delete(id)
      loadData()
      toast.success("Hotel eliminado")
    } catch (error) {
      toast.error("Error al eliminar hotel")
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso Administrativo</CardTitle>
            <CardDescription>Ingresa la contraseña para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                />
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>

        <Tabs defaultValue="coordinadores" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="coordinadores">Coordinadores</TabsTrigger>
            <TabsTrigger value="hoteles">Hoteles</TabsTrigger>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="coordinadores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crear Coordinador</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCoordinador} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={newCoordinador.nombre}
                        onChange={(e) => setNewCoordinador((prev) => ({ ...prev, nombre: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        value={newCoordinador.empresa}
                        onChange={(e) => setNewCoordinador((prev) => ({ ...prev, empresa: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                      <Input
                        id="fecha_inicio"
                        type="date"
                        value={newCoordinador.fecha_inicio}
                        onChange={(e) => setNewCoordinador((prev) => ({ ...prev, fecha_inicio: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fecha_fin">Fecha Fin</Label>
                      <Input
                        id="fecha_fin"
                        type="date"
                        value={newCoordinador.fecha_fin}
                        onChange={(e) => setNewCoordinador((prev) => ({ ...prev, fecha_fin: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Coordinador
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {coordinadores.map((coordinador) => (
                <Card key={coordinador.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{coordinador.nombre}</h3>
                        <p className="text-sm text-gray-600">{coordinador.empresa}</p>
                        <p className="text-sm text-gray-500">
                          {coordinador.fecha_inicio} - {coordinador.fecha_fin}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <QRCodeComponent value={coordinador.token_qr} size={80} />
                          <p className="text-xs text-gray-500 mt-1">QR Coordinador</p>
                          <div className="mt-2 space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/reserva/${coordinador.token_qr}`,
                                )
                              }
                              className="text-xs"
                            >
                              Copiar URL
                            </Button>
                            <p className="text-xs text-gray-400">Token: {coordinador.token_qr.substring(0, 8)}...</p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCoordinador(coordinador.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hoteles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crear Hotel</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateHotel} className="flex gap-2">
                  <Input
                    value={newHotel}
                    onChange={(e) => setNewHotel(e.target.value)}
                    placeholder="Nombre del hotel"
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-2">
              {hoteles.map((hotel) => (
                <Card key={hotel.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{hotel.nombre}</span>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteHotel(hotel.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reservas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    value={filters.hotel_id}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, hotel_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los hoteles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los hoteles</SelectItem>
                      {hoteles.map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id}>
                          {hotel.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.coordinador_id}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, coordinador_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los coordinadores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los coordinadores</SelectItem>
                      {coordinadores.map((coord) => (
                        <SelectItem key={coord.id} value={coord.id}>
                          {coord.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.estado}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, estado: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="devuelto">Devuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={loadData} className="mt-4">
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {pasajeros.map((pasajero) => (
                <Card key={pasajero.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{pasajero.nombre || "Sin nombre"}</h3>
                          {getEstadoBadge(pasajero.estado)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Hotel:</strong> {pasajero.hotel?.nombre}
                          </p>
                          <p>
                            <strong>Sillas:</strong> {pasajero.cantidad_sillas}
                          </p>
                          <p>
                            <strong>Coordinador:</strong> {pasajero.coordinador?.nombre}
                          </p>
                          <p>
                            <strong>Fecha:</strong> {new Date(pasajero.fecha_creacion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <QRCodeComponent value={pasajero.qr_token} size={60} />
                        <p className="text-xs text-gray-500 mt-1">QR Pasajero</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(pasajero.qr_token)}
                          className="text-xs mt-1"
                        >
                          Copiar Token
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reportes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{coordinadores.length}</p>
                    <p className="text-sm text-gray-600">Coordinadores Activos</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{hoteles.length}</p>
                    <p className="text-sm text-gray-600">Hoteles Registrados</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{pasajeros.length}</p>
                    <p className="text-sm text-gray-600">Total Reservas</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {pasajeros.reduce((sum, p) => sum + p.cantidad_sillas, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Sillas Reservadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
