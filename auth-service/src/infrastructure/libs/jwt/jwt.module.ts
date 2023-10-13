import { Module } from '@nestjs/common';
import { Jwt } from './jwt';

@Module({
  providers: [Jwt],
  exports: [Jwt],
})
export class JwtModule {}
