import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoordinadorService } from "./coordinador.service"
import { CoordinadorController } from "./coordinador.controller"
import { Coordinador } from "./coordinador.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Coordinador])],
  controllers: [CoordinadorController],
  providers: [CoordinadorService],
  exports: [CoordinadorService],
})
export class CoordinadorModule {}
