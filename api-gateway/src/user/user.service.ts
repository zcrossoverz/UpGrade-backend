import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices/client';
import { MESSAGE_PATTERNS_USER } from './messagePattern';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  create(createUserDto: CreateUserDto) {
    return this.client.send(MESSAGE_PATTERNS_USER.create, createUserDto);
  }

  getList() {
    return this.client.send(MESSAGE_PATTERNS_USER.getList, {});
  }

  findOne(id: number) {
    return this.client.send(MESSAGE_PATTERNS_USER.getOne, { id });
  }

  update(updateUserDto: UpdateUserDto) {
    return this.client.send(MESSAGE_PATTERNS_USER.update, {
      ...updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
