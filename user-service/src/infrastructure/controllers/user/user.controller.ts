import { Controller, Inject, ParseIntPipe } from '@nestjs/common';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUserUseCases } from 'src/usecases/user/createUser.usecases';
import { DeleteUserUseCases } from 'src/usecases/user/deleteUser.usecases';
import { GetUserUseCases } from 'src/usecases/user/getUser.usecases';
import { GetUsersUseCases } from 'src/usecases/user/getUsers.usecases';
import { UpdateUserUseCases } from 'src/usecases/user/updateUser.usecases';
import { UserPresenter } from './user.presenter';
import { CreateUserDto } from './user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserM } from 'src/domain/model/user';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UsecasesProxyModule.GET_USER_USECASES_PROXY)
    private readonly getUserUsercasesProxy: UseCaseProxy<GetUserUseCases>,
    @Inject(UsecasesProxyModule.GET_USERS_USECASES_PROXY)
    private readonly getUsersUsecasesProxy: UseCaseProxy<GetUsersUseCases>,
    @Inject(UsecasesProxyModule.POST_USER_USECASES_PROXY)
    private readonly createUserUsecasesProxy: UseCaseProxy<CreateUserUseCases>,
    @Inject(UsecasesProxyModule.PUT_USER_USECASES_PROXY)
    private readonly updateUserUsecasesProxy: UseCaseProxy<UpdateUserUseCases>,
    @Inject(UsecasesProxyModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUsecasesProxy: UseCaseProxy<DeleteUserUseCases>,
  ) {}

  @MessagePattern({
    prefix: 'user',
    action: 'get-user',
  })
  async getUser(@Payload('id', ParseIntPipe) id: number) {
    const user = await this.getUserUsercasesProxy.getInstance().execute(id);
    return new UserPresenter(user);
  }

  @MessagePattern({
    prefix: 'user',
    action: 'get-list-user',
  })
  async getAllUser() {
    const users = await this.getUsersUsecasesProxy.getInstance().execute();
    return users.map((user) => new UserPresenter(user));
  }

  @MessagePattern({
    prefix: 'user',
    action: 'update-user',
  })
  async updateUser(@Payload() updateUserDto: UserM) {
    const { id } = updateUserDto;
    const result = await this.updateUserUsecasesProxy
      .getInstance()
      .execute(id, updateUserDto);

    return result;
  }

  @MessagePattern({
    prefix: 'user',
    action: 'create-user',
  })
  async createUser(@Payload() createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;
    const result = await this.createUserUsecasesProxy
      .getInstance()
      .execute(email, password, firstName, lastName);

    return new UserPresenter(result);
  }

  @MessagePattern({
    prefix: 'user',
    action: 'delete-user',
  })
  async deleteUser(@Payload('id', ParseIntPipe) id: number) {
    await this.deleteUserUsecasesProxy.getInstance().execute(id);

    return true;
  }
}
