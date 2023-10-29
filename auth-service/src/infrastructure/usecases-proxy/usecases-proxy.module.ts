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
import { ValidateToken } from 'src/usecases/auth/validateToken';
import { RefreshTokenUseCase } from 'src/usecases/auth/refreshToken';
import { RevokeTokenUseCase } from 'src/usecases/auth/revokeToken';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';

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
    EnvironmentConfigModule,
  ],
})
export class UsecasesProxyModule {
  static POST_AUTHENTICATION_LOGIN_USECASES_PROXY =
    'postAuthenticationUsecasesProxy';

  static POST_AUTHENTICATION_VALIDATETOKEN_USECASES_PROXY =
    'postAuthenticationValidateToken';

  static POST_AUTHENTICATION_REFRESHTOKEN_USECASES_PROXY =
    'postAuthenticationRefreshToken';

  static POST_AUTHENTICATION_REVOKETOKEN_USECASES_PROXY =
    'postAuthenticationRevokeToken';

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
            EnvironmentConfigService,
          ],
          provide: UsecasesProxyModule.POST_AUTHENTICATION_LOGIN_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            logger: LoggerService,
            bcrypt: Bcrypt,
            jwt: Jwt,
            cacheManager: CacheService,
            crypto: Crypto,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(
                logger,
                userRepository,
                bcrypt,
                jwt,
                cacheManager,
                crypto,
                config,
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            Jwt,
            CacheService,
            Crypto,
            EnvironmentConfigService,
          ],
          provide:
            UsecasesProxyModule.POST_AUTHENTICATION_VALIDATETOKEN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwt: Jwt,
            cacheManager: CacheService,
            crypto: Crypto,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new ValidateToken(logger, jwt, cacheManager, crypto, config),
            ),
        },
        {
          inject: [
            LoggerService,
            Crypto,
            Jwt,
            CacheService,
            EnvironmentConfigService,
            DatabaseUserRepository,
          ],
          provide:
            UsecasesProxyModule.POST_AUTHENTICATION_REFRESHTOKEN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            crypto: Crypto,
            jwt: Jwt,
            cacheManager: CacheService,
            config: EnvironmentConfigService,
            userRepository: DatabaseUserRepository,
          ) =>
            new UseCaseProxy(
              new RefreshTokenUseCase(
                logger,
                crypto,
                jwt,
                cacheManager,
                config,
                userRepository,
              ),
            ),
        },
        {
          inject: [LoggerService, Jwt, CacheService, EnvironmentConfigService],
          provide:
            UsecasesProxyModule.POST_AUTHENTICATION_REVOKETOKEN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwt: Jwt,
            cacheManager: CacheService,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new RevokeTokenUseCase(logger, jwt, cacheManager, config),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.POST_AUTHENTICATION_LOGIN_USECASES_PROXY,
        UsecasesProxyModule.POST_AUTHENTICATION_VALIDATETOKEN_USECASES_PROXY,
        UsecasesProxyModule.POST_AUTHENTICATION_REFRESHTOKEN_USECASES_PROXY,
        UsecasesProxyModule.POST_AUTHENTICATION_REVOKETOKEN_USECASES_PROXY,
      ],
    };
  }
}
