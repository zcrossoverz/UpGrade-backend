import { RpcException } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class GetUsersUseCases {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(): Promise<UserM[]> {
    throw new RpcException(new BadRequestException('Method not implemented'));
    return await this.userRepository.findAll();
  }
}
