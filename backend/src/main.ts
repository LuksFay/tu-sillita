import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ["http://localhost:3000", "https://tu-sillita.vercel.app", "https://*.vercel.app"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Prefijo global para la API
  app.setGlobalPrefix("api")

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle("Tu Sillita API")
    .setDescription("API para sistema de alquiler de sillas")
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)

  console.log("🚀 Backend corriendo en http://localhost:" + port)
  console.log("📚 Documentación en http://localhost:" + port + "/api/docs")
}
bootstrap()
