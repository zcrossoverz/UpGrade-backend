import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { ICrypto } from 'src/domain/interface/crypto';
import { IJwt } from 'src/domain/interface/jwt';
import { ILogger } from 'src/domain/logger/logger.interface';
import { IUserRepository } from 'src/domain/repositories/userRepository.interface';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { User } from 'src/infrastructure/entities/user.entity';

export class RefreshTokenUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly crypto: ICrypto,
    private readonly jwt: IJwt,
    private readonly cacheManager: Cache,
    private readonly config: EnvironmentConfigService,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(tokenUUID: string) {
    if (!tokenUUID.includes('Bearer ')) {
      throw new RpcException(new BadRequestException('token must be bearer'));
    }

    this.logger.log('uuid key', tokenUUID);

    let redisKey: { uuid: any; expired: any };
    try {
      redisKey = this.jwt.verify(
        tokenUUID.replace('Bearer ', ''),
        this.config.getJwtSecret(),
      );
    } catch (error) {
      throw new RpcException(
        new HttpException('token invalid!', HttpStatus.UNAUTHORIZED),
      );
    }

    const { uuid } = redisKey;

    this.logger.log('uuid', JSON.stringify(uuid));

    const user: User = await this.cacheManager.get(uuid);
    this.logger.debug('user', JSON.stringify(user));
    const refetchUser = await this.userRepository.findById(user.id);
    if ('password' in refetchUser) {
      delete refetchUser.password;
    }
    this.logger.debug('refetchUser', JSON.stringify(refetchUser));
    const newUUID = this.crypto.randomUUID();
    await this.cacheManager.set(newUUID, refetchUser, 30); // 30 days
    await this.cacheManager.del(uuid);
    this.logger.log('refresh token', `delete token ${uuid}`);
    const newToken = this.jwt.sign(
      {
        uuid: newUUID,
        ttl: 30 * 24 * 60 * 60 * 1000,
      },
      this.config.getJwtSecret(),
    );

    this.logger.log('refresh token', `create token ${newUUID}: ${newToken}`);
    return newToken;
  }
}
