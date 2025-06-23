"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { coordinadorApi, empresaApi, tiempoApi } from "@/lib/api"
import { toast } from "sonner"
import { QRCodeComponent } from "@/components/qr-code"
import { Plus, Trash2, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Coordinador, Empresa, Tiempo } from "@/types"

export default function CoordinadoresPage() {
  const [coordinadores, setCoordinadores] = useState<Coordinador[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [tiempos, setTiempos] = useState<Tiempo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    empresa_id: "",
    tiempo_id: "",
    comision: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [coordResponse, empresasResponse, tiemposResponse] = await Promise.all([
        coordinadorApi.getAll(),
        empresaApi.getAll(),
        tiempoApi.getAll(),
      ])

      setCoordinadores(coordResponse.data)
      setEmpresas(empresasResponse.data)
      setTiempos(tiemposResponse.data)
    } catch (error) {
      toast.error("Error al cargar los datos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.empresa_id || !formData.tiempo_id) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    try {
      if (editingId) {
        await coordinadorApi.update(editingId, formData)
        toast.success("Coordinador actualizado exitosamente")
      } else {
        await coordinadorApi.create(formData)
        toast.success("Coordinador creado exitosamente")
      }

      resetForm()
      loadData()
    } catch (error) {
      toast.error("Error al guardar coordinador")
      console.error(error)
    }
  }

  const handleEdit = (coordinador: Coordinador) => {
    setFormData({
      nombre: coordinador.nombre,
      empresa_id: coordinador.empresa_id,
      tiempo_id: coordinador.tiempo_id,
      comision: coordinador.comision,
    })
    setEditingId(coordinador.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este coordinador?")) return

    try {
      await coordinadorApi.delete(id)
      toast.success("Coordinador eliminado")
      loadData()
    } catch (error) {
      toast.error("Error al eliminar coordinador")
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({ nombre: "", empresa_id: "", tiempo_id: "", comision: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-4">Coordinadores</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? "Editar Coordinador" : "Crear Coordinador"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="empresa">Empresa *</Label>
                    <Select
                      value={formData.empresa_id}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, empresa_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem key={empresa.id} value={empresa.id}>
                            {empresa.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tiempo">Tiempo *</Label>
                    <Select
                      value={formData.tiempo_id}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, tiempo_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiempos.map((tiempo) => (
                          <SelectItem key={tiempo.id} value={tiempo.id}>
                            {tiempo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="comision">Comisión</Label>
                    <Input
                      id="comision"
                      type="number"
                      step="0.01"
                      value={formData.comision}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, comision: Number.parseFloat(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingId ? "Actualizar" : "Crear"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de coordinadores */}
        <div className="grid gap-4">
          {coordinadores.map((coordinador) => (
            <Card key={coordinador.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{coordinador.nombre}</h3>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p>
                        <strong>Empresa:</strong> {coordinador.empresa?.nombre}
                      </p>
                      <p>
                        <strong>Tiempo:</strong> {coordinador.tiempo?.nombre}
                      </p>
                      <p>
                        <strong>Comisión:</strong> ${coordinador.comision}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <QRCodeComponent value={coordinador.qr_code} size={80} />
                      <p className="text-xs text-gray-500 mt-1">QR Code</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(coordinador.qr_code)}
                        className="text-xs mt-1"
                      >
                        Copiar QR
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(coordinador)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(coordinador.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {coordinadores.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No hay coordinadores registrados</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                Crear el primero
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
