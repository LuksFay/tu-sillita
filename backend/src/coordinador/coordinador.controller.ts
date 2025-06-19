import { Controller, Get, Post, Param, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { CoordinadorService } from "./coordinador.service"
import type { CreateCoordinadorDto } from "./dto/create-coordinador.dto"

@ApiTags("coordinadores")
@Controller("coordinadores")
export class CoordinadorController {
  constructor(private readonly coordinadorService: CoordinadorService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo coordinador" })
  @ApiResponse({ status: 201, description: "Coordinador creado exitosamente" })
  create(createCoordinadorDto: CreateCoordinadorDto) {
    return this.coordinadorService.create(createCoordinadorDto)
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los coordinadores activos" })
  findAll() {
    return this.coordinadorService.findAll()
  }

  @Get('token/:token')
  @ApiOperation({ summary: 'Buscar coordinador por token QR' })
  findByToken(@Param('token') token: string) {
    return this.coordinadorService.findByToken(token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar coordinador (marcar como inactivo)' })
  remove(@Param('id') id: string) {
    return this.coordinadorService.remove(id);
  }
}
