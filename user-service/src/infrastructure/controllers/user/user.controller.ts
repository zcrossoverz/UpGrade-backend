import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
@ApiTags('user')
@ApiResponse({
  status: 500,
  description: 'Internal error',
})
@ApiExtraModels(UserPresenter)
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

  @Get('user')
  @ApiOkResponse({
    description: 'user record',
    type: UserPresenter,
    isArray: false,
  })
  async getUser(@Query('id', ParseIntPipe) id: number) {
    const user = await this.getUserUsercasesProxy.getInstance().execute(id);
    return new UserPresenter(user);
  }

  @Get('users')
  @ApiOkResponse({
    description: 'user records',
    type: Array<UserPresenter>,
    isArray: true,
  })
  async getAllUser() {
    const users = await this.getUsersUsecasesProxy.getInstance().execute();
    return users.map((user) => new UserPresenter(user));
  }

  @Put('user')
  @ApiOkResponse({
    description: 'update user record',
    type: Boolean,
    isArray: false,
  })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const { id, firstName, lastName } = updateUserDto;
    const result = await this.updateUserUsecasesProxy
      .getInstance()
      .execute(id, firstName, lastName);

    return result;
  }

  @Post('user')
  @ApiOkResponse({
    description: 'create user record',
    type: UserPresenter,
    isArray: false,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;
    const result = await this.createUserUsecasesProxy
      .getInstance()
      .execute(username, password, email);

    return new UserPresenter(result);
  }

  @Delete('user')
  @ApiOkResponse({
    description: 'delete user record',
    type: UserPresenter,
    isArray: false,
  })
  async deleteUser(@Query('id', ParseIntPipe) id: number) {
    await this.deleteUserUsecasesProxy.getInstance().execute(id);

    return true;
  }
}
