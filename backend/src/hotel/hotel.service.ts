import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Hotel } from "./hotel.entity"

@Injectable()
export class HotelService {
  constructor(private hotelRepository: Repository<Hotel>) {}

  async create(nombre: string): Promise<Hotel> {
    // Verificar si ya existe
    const existingHotel = await this.hotelRepository.findOne({
      where: { nombre },
    })

    if (existingHotel) {
      throw new ConflictException("Ya existe un hotel con ese nombre")
    }

    const hotel = this.hotelRepository.create({ nombre })
    return await this.hotelRepository.save(hotel)
  }

  async findAll(): Promise<Hotel[]> {
    return await this.hotelRepository.find({
      order: { nombre: "ASC" },
    })
  }

  async remove(id: string): Promise<void> {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: ["pasajeros"],
    })

    if (!hotel) {
      throw new NotFoundException("Hotel no encontrado")
    }

    if (hotel.pasajeros && hotel.pasajeros.length > 0) {
      throw new ConflictException("No se puede eliminar un hotel con reservas asociadas")
    }

    await this.hotelRepository.remove(hotel)
  }
}
