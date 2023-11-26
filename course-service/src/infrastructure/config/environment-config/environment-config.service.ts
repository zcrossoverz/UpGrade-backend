import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/domain/config/database.interface';

@Injectable()
export class EnvironmentConfigService implements AppConfig {
  constructor(private configService: ConfigService) {}
  getChatGptApiKey(): string {
    return this.configService.get<string>('OPENAI_API');
  }
  getDriveClientId(): string {
    return this.configService.get<string>('GDRIVE_CLIENT_ID');
  }
  getDriveClientSecret(): string {
    return this.configService.get<string>('GDRIVE_SECRET_KEY');
  }
  getDriveRedirectUri(): string {
    return this.configService.get<string>('GDRIVE_URI_CALLBACK');
  }
  getDriveMainFolderId(): string {
    return this.configService.get<string>('GDRIVE_MAINFOLDER_ID');
  }
  getDriveAccessToken(): string {
    return this.configService.get<string>('GDRIVE_ACCESS_TOKEN');
  }
  getDriveRefreshToken(): string {
    return this.configService.get<string>('GDRIVE_REFRESH_TOKEN');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDatabasePort(): number {
    return this.configService.get<number>('DB_PORT');
  }
  getDatabaseUser(): string {
    return this.configService.get<string>('DB_USER');
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DB_NAME');
  }
  getDatabaseSchema(): string {
    return this.configService.get<string>('DB_SCHEMA');
  }
  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('DB_SYNC');
  }
  getRabbitMQUri(): string {
    return this.configService.get<string>('RBMQ_URI');
  }
}
