import { Controller, Get, Post, Param, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation } from "@nestjs/swagger"
import type { HotelService } from "./hotel.service"

@ApiTags("hoteles")
@Controller("hoteles")
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo hotel" })
  create(body: { nombre: string }) {
    return this.hotelService.create(body.nombre)
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los hoteles" })
  findAll() {
    return this.hotelService.findAll()
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar hotel' })
  remove(@Param('id') id: string) {
    return this.hotelService.remove(id);
  }
}
