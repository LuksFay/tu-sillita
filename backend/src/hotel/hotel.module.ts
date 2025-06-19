import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { HotelService } from "./hotel.service"
import { HotelController } from "./hotel.controller"
import { Hotel } from "./hotel.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
