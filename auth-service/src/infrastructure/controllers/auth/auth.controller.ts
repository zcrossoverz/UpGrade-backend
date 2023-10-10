import { Controller, Inject } from '@nestjs/common';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, ResponseDto } from './auth.dto';
import { LoginUseCase } from 'src/usecases/auth/login.usecase';

@Controller()
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.POST_AUTHENTICATION_LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCase>,
  ) {}

  @MessagePattern({
    prefix: 'authentication',
    action: 'login',
  })
  async getUser(@Payload() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const result = await this.loginUseCaseProxy
      .getInstance()
      .execute(email, password);
    return new ResponseDto(result);
  }
}
