import { Module } from '@nestjs/common';
import { Bcrypt } from './bcrypt';

@Module({
  providers: [Bcrypt],
  exports: [Bcrypt],
})
export class BcryptJSModule {}
