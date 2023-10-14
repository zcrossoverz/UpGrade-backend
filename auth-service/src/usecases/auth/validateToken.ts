import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { ICrypto } from 'src/domain/interface/crypto';
import { IJwt } from 'src/domain/interface/jwt';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserM } from 'src/domain/model/user';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

export class ValidateToken {
  constructor(
    private readonly logger: ILogger,
    private readonly jwt: IJwt,
    private readonly cacheManager: Cache,
    private readonly crypto: ICrypto,
    private readonly config: EnvironmentConfigService,
  ) {}

  async execute(tokenUUID: string) {
    if (!tokenUUID.includes('Bearer ')) {
      throw new RpcException(new BadRequestException('token must be bearer'));
    }
    const redisKey = this.jwt.verify(
      tokenUUID.replace('Bearer ', ''),
      this.config.getJwtSecret(),
    );
    const { uuid, expired } = redisKey;
    const remainingMilliseconds = expired - new Date().getTime();
    const remainingDays = Math.ceil(
      remainingMilliseconds / (1000 * 60 * 60 * 24),
    );
    this.logger.log('expired date', `${remainingDays}`);
    this.logger.log('uuid', JSON.stringify(uuid));
    const user: UserM = await this.cacheManager.get(uuid || '');
    this.logger.log('user', JSON.stringify(user));
    if (!user) {
      throw new RpcException(
        new HttpException('token invalid!', HttpStatus.UNAUTHORIZED),
      );
    }
    if (remainingDays < 3 && user) {
      const newUUID = this.crypto.randomUUID();
      await this.cacheManager.set(newUUID, user, 30); // 30 days
      await this.cacheManager.del(uuid);
      const newToken = this.jwt.sign(
        {
          uuid: newUUID,
          expired: new Date(
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
          ).getTime(),
        },
        'nhan',
      );

      this.logger.log('refresh token', 'token refreshed');
      return {
        ...user,
        newToken,
        tokenRefresh: true,
      };
    }
    this.logger.log('validate token', JSON.stringify(user));
    return {
      ...user,
      tokenRefresh: false,
    };
  }
}
