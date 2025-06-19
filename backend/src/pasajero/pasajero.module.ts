import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PasajeroService } from "./pasajero.service"
import { PasajeroController } from "./pasajero.controller"
import { Pasajero } from "./pasajero.entity"
import { CoordinadorModule } from "../coordinador/coordinador.module"

@Module({
  imports: [TypeOrmModule.forFeature([Pasajero]), CoordinadorModule],
  controllers: [PasajeroController],
  providers: [PasajeroService],
})
export class PasajeroModule {}
