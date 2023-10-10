import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IBcryptJS } from 'src/domain/interface/bcrypt';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';

export class LoginUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptJS,
  ) {}

  async execute(email: string, password: string): Promise<any> {
    this.logger.log('login', JSON.stringify({ email, password }));
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new RpcException(new BadRequestException('email not found!'));
    }

    if (!this.bcrypt.compareSync(password, user.password)) {
      this.logger.log('login failed', JSON.stringify({ email, password }));
      throw new RpcException(
        new BadRequestException('password is not correct!'),
      );
    } else {
      this.logger.log('login success', JSON.stringify(user));
      return 'login success';
    }
  }
}
