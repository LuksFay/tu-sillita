import { IsEnum } from "class-validator"
import { EstadoPasajero } from "../pasajero.entity"

export class UpdateEstadoDto {
  @IsEnum(EstadoPasajero)
  estado: EstadoPasajero
}
