import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { IJwt } from 'src/domain/interface/jwt';
import { ILogger } from 'src/domain/logger/logger.interface';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

export class RevokeTokenUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly jwt: IJwt,
    private readonly cacheManager: Cache,
    private readonly config: EnvironmentConfigService,
  ) {}

  async execute(tokenUUID: string) {
    if (!tokenUUID.includes('Bearer ')) {
      throw new RpcException(new BadRequestException('token must be bearer'));
    }
    this.logger.log('secret key', this.config.getJwtSecret());
    const redisKey = this.jwt.verify(
      tokenUUID.replace('Bearer ', ''),
      this.config.getJwtSecret(),
    );
    const { uuid } = redisKey;
    this.cacheManager.del(uuid);
    this.logger.log('revoke token', JSON.stringify(uuid));
    return {
      message: `Revoke token with UUID: ${uuid}`,
    };
  }
}
