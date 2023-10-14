/* eslint-disable @typescript-eslint/no-unused-vars */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, Store, WrapTTL } from 'cache-manager';

@Injectable()
export class CacheService implements Cache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async set(key: string, value: unknown, dayTtl?: number) {
    await this.cacheManager.set(key, value, dayTtl * 24 * 60 * 60 * 1000);
  }
  async get<T>(key: string) {
    return await this.cacheManager.get<T>(key);
  }
  async del(key: string) {
    await this.cacheManager.del(key);
  }
  async reset() {
    return await this.cacheManager.reset();
  }

  wrap<T>(_key: string, _fn: () => Promise<T>, _ttl?: WrapTTL<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }
  store: Store;
}
