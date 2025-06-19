import { IsString, IsNotEmpty, IsDateString } from "class-validator"

export class CreateCoordinadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string

  @IsString()
  @IsNotEmpty()
  empresa: string

  @IsDateString()
  fecha_inicio: string

  @IsDateString()
  fecha_fin: string
}
