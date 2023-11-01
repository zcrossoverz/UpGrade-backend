import { Global, Module } from '@nestjs/common';
import { GDrive } from './gdrive';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  providers: [GDrive],
  exports: [GDrive],
  imports: [ConfigModule],
})
export class GdriveModule {}
