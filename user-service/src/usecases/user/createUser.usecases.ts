import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserM } from 'src/domain/model/user';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { IBcryptJS } from 'src/domain/interface/bcrypt';

export class CreateUserUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptJS,
  ) {}
  async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<UserM> {
    if (!email || !password || !firstName || !lastName) {
      throw new RpcException(
        new BadRequestException('all field are required!'),
      );
    }

    const regExValidateEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;

    if (!regExValidateEmail.test(email)) {
      throw new RpcException(new BadRequestException('email is not valid!'));
    }

    const user = new UserM();
    user.email = email;
    user.password = this.bcrypt.hashSync(password, 8);
    user.firstName = firstName;
    user.lastName = lastName;

    const result = await this.userRepository.create(user);

    this.logger.log('createUserUsecases execute', 'New user have been created');
    return result;
  }
}
