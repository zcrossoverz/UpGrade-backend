import { Module } from '@nestjs/common';
import { Crypto } from './crypto';

@Module({
  providers: [Crypto],
  exports: [Crypto],
})
export class CryptoModule {}
