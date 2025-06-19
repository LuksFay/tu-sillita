import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from "class-validator"

export class CreatePasajeroDto {
  @IsOptional()
  @IsString()
  nombre?: string

  @IsString()
  @IsNotEmpty()
  hotel_id: string

  @IsNumber()
  @Min(1)
  @Max(10)
  cantidad_sillas: number

  @IsString()
  @IsNotEmpty()
  coordinador_token: string
}
