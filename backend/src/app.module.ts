import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CoordinadorModule } from "./coordinador/coordinador.module"
import { HotelModule } from "./hotel/hotel.module"
import { PasajeroModule } from "./pasajero/pasajero.module"
import { AuthModule } from "./auth/auth.module"
import { Coordinador } from "./coordinador/coordinador.entity"
import { Hotel } from "./hotel/hotel.entity"
import { Pasajero } from "./pasajero/pasajero.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "tu_sillita"),
        entities: [Coordinador, Hotel, Pasajero],
        synchronize: configService.get("NODE_ENV") !== "production",
        logging: configService.get("NODE_ENV") === "development",
        ssl: configService.get("NODE_ENV") === "production" ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    CoordinadorModule,
    HotelModule,
    PasajeroModule,
    AuthModule,
  ],
})
export class AppModule {}
