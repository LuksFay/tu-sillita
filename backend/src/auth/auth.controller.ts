import { Controller, Post, Body } from "@nestjs/common"

@Controller("auth")
export class AuthController {
  @Post('login')
  login(@Body() body: any) {
    const password = body.password;
    // Contraseña fija para demo
    if (password === 'admin123') {
      return { token: 'authenticated', message: 'Login exitoso' };
    }
    
    throw new Error('Contraseña incorrecta');
  }
}
