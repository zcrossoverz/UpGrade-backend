import { Controller, Inject } from '@nestjs/common';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, ResponseDto } from './auth.dto';
import { LoginUseCase } from 'src/usecases/auth/login.usecase';
import { ValidateToken } from 'src/usecases/auth/validateToken';
import { RefreshTokenUseCase } from 'src/usecases/auth/refreshToken';
import { RevokeTokenUseCase } from 'src/usecases/auth/revokeToken';

@Controller()
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.POST_AUTHENTICATION_LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCase>,
    @Inject(
      UsecasesProxyModule.POST_AUTHENTICATION_VALIDATETOKEN_USECASES_PROXY,
    )
    private readonly validateUseCaseProxy: UseCaseProxy<ValidateToken>,

    @Inject(UsecasesProxyModule.POST_AUTHENTICATION_REFRESHTOKEN_USECASES_PROXY)
    private readonly refreshTokenUseCaseProxy: UseCaseProxy<RefreshTokenUseCase>,

    @Inject(UsecasesProxyModule.POST_AUTHENTICATION_REVOKETOKEN_USECASES_PROXY)
    private readonly revokeToKenUseCasesProxy: UseCaseProxy<RevokeTokenUseCase>,
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

  @MessagePattern({
    prefix: 'authentication',
    action: 'validate-token',
  })
  async validateToken(@Payload() payload) {
    const { token } = payload;
    const result = await this.validateUseCaseProxy.getInstance().execute(token);
    return result;
  }

  @MessagePattern({
    prefix: 'authentication',
    action: 'refresh-token',
  })
  async refreshToken(@Payload() payload) {
    const { token } = payload;
    const result = await this.refreshTokenUseCaseProxy
      .getInstance()
      .execute(token);
    return result;
  }

  @MessagePattern({
    prefix: 'authentication',
    action: 'revoke-token',
  })
  async revokeToken(@Payload() payload) {
    const { token } = payload;
    const result = await this.revokeToKenUseCasesProxy
      .getInstance()
      .execute(token);
    return result;
  }
}
