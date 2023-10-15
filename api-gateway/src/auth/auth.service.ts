import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS_AUTH } from './messagePattern';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  login(email: string, password: string) {
    return this.client.send(MESSAGE_PATTERNS_AUTH.login, { email, password });
  }

  async validateToken(token: string) {
    const cacheResult = await this.cacheManager.get(
      token.replace('Bearer ', 'SESSION_'),
    );
    if (cacheResult) {
      return cacheResult;
    } else {
      const result = await this.client
        .send(MESSAGE_PATTERNS_AUTH.validateToken, {
          token,
        })
        .toPromise();

      this.cacheManager.set(
        token.replace('Bearer ', 'SESSION_'),
        result,
        5 * 60 * 1000,
      );
      return result;
    }
  }

  revokeToken(token: string) {
    return this.client.send(MESSAGE_PATTERNS_AUTH.revokeToken, { token });
  }
}
