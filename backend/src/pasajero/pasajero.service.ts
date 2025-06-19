import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Pasajero, EstadoPasajero } from "./pasajero.entity"
import type { CreatePasajeroDto } from "./dto/create-pasajero.dto"
import type { CoordinadorService } from "../coordinador/coordinador.service"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class PasajeroService {
  constructor(
    private pasajeroRepository: Repository<Pasajero>,
    private coordinadorService: CoordinadorService,
  ) {}

  async create(createPasajeroDto: CreatePasajeroDto): Promise<Pasajero> {
    // Verificar que el coordinador existe y está activo
    const coordinador = await this.coordinadorService.findByToken(createPasajeroDto.coordinador_token)

    const pasajero = this.pasajeroRepository.create({
      nombre: createPasajeroDto.nombre,
      hotel_id: createPasajeroDto.hotel_id,
      cantidad_sillas: createPasajeroDto.cantidad_sillas,
      coordinador_id: coordinador.id,
      qr_token: uuidv4(),
    })

    const savedPasajero = await this.pasajeroRepository.save(pasajero)

    // Retornar con relaciones
    return await this.pasajeroRepository.findOne({
      where: { id: savedPasajero.id },
      relations: ["hotel", "coordinador"],
    })
  }

  async findAll(filters?: {
    hotel_id?: string
    coordinador_id?: string
    estado?: string
    fecha?: string
  }): Promise<Pasajero[]> {
    const query = this.pasajeroRepository
      .createQueryBuilder("pasajero")
      .leftJoinAndSelect("pasajero.hotel", "hotel")
      .leftJoinAndSelect("pasajero.coordinador", "coordinador")

    if (filters?.hotel_id && filters.hotel_id !== "all") {
      query.andWhere("pasajero.hotel_id = :hotel_id", {
        hotel_id: filters.hotel_id,
      })
    }

    if (filters?.coordinador_id && filters.coordinador_id !== "all") {
      query.andWhere("pasajero.coordinador_id = :coordinador_id", {
        coordinador_id: filters.coordinador_id,
      })
    }

    if (filters?.estado && filters.estado !== "all") {
      query.andWhere("pasajero.estado = :estado", { estado: filters.estado })
    }

    if (filters?.fecha) {
      query.andWhere("DATE(pasajero.fecha_creacion) = :fecha", {
        fecha: filters.fecha,
      })
    }

    return await query.orderBy("pasajero.fecha_creacion", "DESC").getMany()
  }

  async findByToken(token: string): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.findOne({
      where: { qr_token: token },
      relations: ["hotel", "coordinador"],
    })

    if (!pasajero) {
      throw new NotFoundException("Pasajero no encontrado")
    }

    return pasajero
  }

  async updateEstado(token: string, nuevoEstado: EstadoPasajero): Promise<Pasajero> {
    const pasajero = await this.findByToken(token)

    // Validar transiciones de estado
    if (pasajero.estado === EstadoPasajero.PENDIENTE && nuevoEstado === EstadoPasajero.DEVUELTO) {
      throw new BadRequestException("No se puede marcar como devuelto sin haber sido entregado")
    }

    if (pasajero.estado === EstadoPasajero.DEVUELTO) {
      throw new BadRequestException("El pasajero ya completó el proceso")
    }

    pasajero.estado = nuevoEstado

    if (nuevoEstado === EstadoPasajero.ENTREGADO) {
      pasajero.fecha_entrega = new Date()
    } else if (nuevoEstado === EstadoPasajero.DEVUELTO) {
      pasajero.fecha_devolucion = new Date()
    }

    return await this.pasajeroRepository.save(pasajero)
  }
}
