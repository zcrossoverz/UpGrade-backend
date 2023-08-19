import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';

export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getDatabaseHost(),
  port: config.getDatabasePort(),
  username: config.getDatabaseUser(),
  password: config.getDatabasePassword(),
  database: config.getDatabaseName(),
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: config.getDatabaseSync(),
  schema: config.getDatabaseSchema(),
  ssl: {
    rejectUnauthorized: false,
  },
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmModuleOptions,
      inject: [EnvironmentConfigService],
      imports: [EnvironmentConfigService],
    }),
  ],
})
export class TypeOrmConfigModule {}
