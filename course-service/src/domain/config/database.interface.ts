export interface AppConfig {
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUser(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
  getDatabaseSchema(): string;
  getDatabaseSync(): boolean;

  getDriveClientId(): string;
  getDriveClientSecret(): string;
  getDriveRedirectUri(): string;
  getDriveMainFolderId(): string;
  getDriveAccessToken(): string;
  getDriveRefreshToken(): string;
}
