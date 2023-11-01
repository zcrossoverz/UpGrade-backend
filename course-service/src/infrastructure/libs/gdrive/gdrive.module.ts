import { Module } from '@nestjs/common';
import { GDrive } from './gdrive';

@Module({
  providers: [GDrive],
  exports: [GDrive],
})
export class GdriveModule {}
