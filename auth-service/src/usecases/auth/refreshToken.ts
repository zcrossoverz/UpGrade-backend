import { Cache } from 'cache-manager';
import { ICrypto } from 'src/domain/interface/crypto';
import { IJwt } from 'src/domain/interface/jwt';
import { ILogger } from 'src/domain/logger/logger.interface';

export class RefreshTokenUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly crypto: ICrypto,
    private readonly jwt: IJwt,
    private readonly cacheManager: Cache,
  ) {}

  async execute(redisUUID: string) {
    const user = await this.cacheManager.get(redisUUID);
    const newUUID = this.crypto.randomUUID();
    await this.cacheManager.set(newUUID, user, 30); // 30 days
    await this.cacheManager.del(redisUUID);
    const newToken = this.jwt.sign(
      {
        uuid: newUUID,
        ttl: 30 * 24 * 60 * 60 * 1000,
      },
      'nhan',
    );

    this.logger.log('validate token', JSON.stringify(user));
    return newToken;
  }
}
