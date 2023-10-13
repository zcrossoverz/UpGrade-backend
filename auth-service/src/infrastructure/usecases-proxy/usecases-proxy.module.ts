import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { DatabaseUserRepository } from '../repositories/user.repository';
import { LoggerService } from '../logger/logger.service';
import { BcryptJSModule } from '../libs/bcryptjs/bcrypt.module';
import { Bcrypt } from '../libs/bcryptjs/bcrypt';
import { LoginUseCase } from 'src/usecases/auth/login.usecase';
import { JwtModule } from '../libs/jwt/jwt.module';
import { Jwt } from '../libs/jwt/jwt';
import { CacheService } from '../libs/cache/cache';
import { CacheCustomModule } from '../libs/cache/cache.module';
import { CryptoModule } from '../libs/crypto/crypto.module';
import { Crypto } from '../libs/crypto/crypto';

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}

@Module({
  imports: [
    LoggerModule,
    RepositoriesModule,
    ExceptionsModule,
    BcryptJSModule,
    JwtModule,
    CacheCustomModule,
    CryptoModule,
  ],
})
export class UsecasesProxyModule {
  static POST_AUTHENTICATION_LOGIN_USECASES_PROXY =
    'postAuthenticationUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            DatabaseUserRepository,
            LoggerService,
            Bcrypt,
            Jwt,
            CacheService,
            Crypto,
          ],
          provide: UsecasesProxyModule.POST_AUTHENTICATION_LOGIN_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            logger: LoggerService,
            bcrypt: Bcrypt,
            jwt: Jwt,
            cacheManager: CacheService,
            crypto: Crypto,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(
                logger,
                userRepository,
                bcrypt,
                jwt,
                cacheManager,
                crypto,
              ),
            ),
        },
      ],
      exports: [UsecasesProxyModule.POST_AUTHENTICATION_LOGIN_USECASES_PROXY],
    };
  }
}
