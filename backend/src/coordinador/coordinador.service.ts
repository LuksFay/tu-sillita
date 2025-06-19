import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Coordinador } from "./coordinador.entity"
import type { CreateCoordinadorDto } from "./dto/create-coordinador.dto"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class CoordinadorService {
  constructor(private coordinadorRepository: Repository<Coordinador>) {}

  async create(createCoordinadorDto: CreateCoordinadorDto): Promise<Coordinador> {
    const coordinador = this.coordinadorRepository.create({
      ...createCoordinadorDto,
      fecha_inicio: new Date(createCoordinadorDto.fecha_inicio),
      fecha_fin: new Date(createCoordinadorDto.fecha_fin),
      token_qr: uuidv4(),
    })

    return await this.coordinadorRepository.save(coordinador)
  }

  async findAll(): Promise<Coordinador[]> {
    return await this.coordinadorRepository.find({
      where: { activo: true },
      order: { fecha_creacion: "DESC" },
    })
  }

  async findByToken(token: string): Promise<Coordinador> {
    const coordinador = await this.coordinadorRepository.findOne({
      where: { token_qr: token, activo: true },
    })

    if (!coordinador) {
      throw new NotFoundException("Coordinador no encontrado o token inválido")
    }

    // Verificar si el token está vigente
    const now = new Date()
    if (now < coordinador.fecha_inicio || now > coordinador.fecha_fin) {
      throw new NotFoundException("Token expirado")
    }

    return coordinador
  }

  async remove(id: string): Promise<void> {
    const coordinador = await this.coordinadorRepository.findOne({
      where: { id },
    })

    if (!coordinador) {
      throw new NotFoundException("Coordinador no encontrado")
    }

    coordinador.activo = false
    await this.coordinadorRepository.save(coordinador)
  }
}
