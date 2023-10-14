import { Cache } from 'cache-manager';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IBcryptJS } from 'src/domain/interface/bcrypt';
import { IJwt } from 'src/domain/interface/jwt';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { ICrypto } from 'src/domain/interface/crypto';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

export class LoginUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptJS,
    private readonly jwt: IJwt,
    private readonly cacheManager: Cache,
    private readonly crypto: ICrypto,
    private readonly config: EnvironmentConfigService,
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
      const uuidToken = this.crypto.randomUUID();
      this.logger.log('uuidToken', uuidToken);
      await this.cacheManager.set(uuidToken, user, 30); // ttl 30 days
      const token = this.jwt.sign(
        {
          uuid: uuidToken,
          expired: new Date(
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
          ).getTime(),
        },
        this.config.getJwtSecret(),
      );
      this.logger.log(
        'get token',
        JSON.stringify(await this.cacheManager.get(uuidToken)),
      );
      this.logger.log('login success', JSON.stringify(user));
      return token;
    }
  }
}
