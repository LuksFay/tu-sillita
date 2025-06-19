import { Controller, Get, Post, Param, Patch, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger"
import type { PasajeroService } from "./pasajero.service"
import type { CreatePasajeroDto } from "./dto/create-pasajero.dto"
import type { UpdateEstadoDto } from "./dto/update-estado.dto"

@ApiTags("pasajeros")
@Controller("pasajeros")
export class PasajeroController {
  constructor(private readonly pasajeroService: PasajeroService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva reserva de pasajero" })
  create(createPasajeroDto: CreatePasajeroDto) {
    return this.pasajeroService.create(createPasajeroDto)
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los pasajeros con filtros opcionales" })
  @ApiQuery({ name: "hotel_id", required: false })
  @ApiQuery({ name: "coordinador_id", required: false })
  @ApiQuery({ name: "estado", required: false })
  @ApiQuery({ name: "fecha", required: false })
  findAll(
    @Query('hotel_id') hotel_id?: string,
    @Query('coordinador_id') coordinador_id?: string,
    @Query('estado') estado?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.pasajeroService.findAll({
      hotel_id,
      coordinador_id,
      estado,
      fecha,
    })
  }

  @Get('token/:token')
  @ApiOperation({ summary: 'Buscar pasajero por token QR' })
  findByToken(@Param('token') token: string) {
    return this.pasajeroService.findByToken(token);
  }

  @Patch("token/:token")
  @ApiOperation({ summary: "Actualizar estado del pasajero" })
  updateEstado(@Param('token') token: string, updateEstadoDto: UpdateEstadoDto) {
    return this.pasajeroService.updateEstado(token, updateEstadoDto.estado)
  }
}
