import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { DatabaseUserRepository } from '../repositories/user.repository';
import { GetUserUseCases } from 'src/usecases/user/getUser.usecases';
import { GetUsersUseCases } from 'src/usecases/user/getUsers.usecases';
import { CreateUserUseCases } from 'src/usecases/user/createUser.usecases';
import { LoggerService } from '../logger/logger.service';
import { UpdateUserUseCases } from 'src/usecases/user/updateUser.usecases';
import { DeleteUserUseCases } from 'src/usecases/user/deleteUser.usecases';

export class UseCaseProxy<T> {
  constructor(private readonly useCase: T) {}
  getInstance(): T {
    return this.useCase;
  }
}

@Module({
  imports: [LoggerModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';
  static GET_USERS_USECASES_PROXY = 'getUsersUsecasesProxy';
  static POST_USER_USECASES_PROXY = 'postUserUsecasesProxy';
  static DELETE_USER_USECASES_PROXY = 'deleteUserUsecasesProxy';
  static PUT_USER_USECASES_PROXY = 'putUserUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [DatabaseUserRepository],
          provide: UsecasesProxyModule.GET_USER_USECASES_PROXY,
          useFactory: (userRepository: DatabaseUserRepository) =>
            new UseCaseProxy(new GetUserUseCases(userRepository)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UsecasesProxyModule.GET_USERS_USECASES_PROXY,
          useFactory: (userRepository: DatabaseUserRepository) =>
            new UseCaseProxy(new GetUsersUseCases(userRepository)),
        },
        {
          inject: [DatabaseUserRepository, LoggerService],
          provide: UsecasesProxyModule.POST_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            logger: LoggerService,
          ) => new UseCaseProxy(new CreateUserUseCases(logger, userRepository)),
        },
        {
          inject: [DatabaseUserRepository, LoggerService],
          provide: UsecasesProxyModule.PUT_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            logger: LoggerService,
          ) => new UseCaseProxy(new UpdateUserUseCases(logger, userRepository)),
        },
        {
          inject: [DatabaseUserRepository, LoggerService],
          provide: UsecasesProxyModule.DELETE_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            logger: LoggerService,
          ) => new UseCaseProxy(new DeleteUserUseCases(logger, userRepository)),
        },
      ],
      exports: [
        UsecasesProxyModule.DELETE_USER_USECASES_PROXY,
        UsecasesProxyModule.GET_USERS_USECASES_PROXY,
        UsecasesProxyModule.GET_USER_USECASES_PROXY,
        UsecasesProxyModule.POST_USER_USECASES_PROXY,
        UsecasesProxyModule.PUT_USER_USECASES_PROXY,
      ],
    };
  }
}
