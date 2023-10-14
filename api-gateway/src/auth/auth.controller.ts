import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  create(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post('/validateToken')
  validateToken(@Headers('authorization') authorizationHeader: string) {
    return this.authService.validateToken(authorizationHeader);
  }

  @Post('/revokeToken')
  revokeToken(@Headers('authorization') authorizationHeader: string) {
    return this.authService.revokeToken(authorizationHeader);
  }
}
