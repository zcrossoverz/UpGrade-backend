import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { IGdrive } from 'src/domain/interface/gdrive';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

@Injectable()
export class GDrive implements IGdrive {
  private readonly config = new EnvironmentConfigService(new ConfigService());

  private readonly oauth2Client = new google.auth.OAuth2(
    this.config.getDriveClientId(),
    this.config.getDriveClientSecret(),
    this.config.getDriveRedirectUri(),
  );

  private readonly drive = google.drive({
    version: 'v3',
    auth: this.oauth2Client,
  });

  private readonly logger = new Logger('GDrive');

  private readonly upgradeFolderId = this.config.getDriveMainFolderId();

  constructor() {
    this.oauth2Client.setCredentials({
      access_token: this.config.getDriveAccessToken(),
      refresh_token: this.config.getDriveRefreshToken(),
      // scope: 'https://www.googleapis.com/auth/drive',
    });
  }
  async getFileId(fileName: string): Promise<any> {
    try {
      const query = `name='${fileName}'`;
      //   this.logger.log(this.drive)
      const result = await this.drive.files.list({
        q: query,
      });

      return result;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
  async getLinkVideo(fileId: string): Promise<any> {
    try {
      const file = await this.drive.files.get({
        fileId,
        alt: 'media',
      });

      return file;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
  async createFolderIfNotExist(folderName: string): Promise<any> {
    try {
      // Check if the folder exists
      const folderQuery = `'${this.upgradeFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder'`;
      const existingFolders = await this.drive.files.list({
        q: folderQuery,
      });

      if (existingFolders.data.files.length > 0) {
        this.logger.log(existingFolders.data, 'retrive folder id');
        return existingFolders.data.files[0].id;
      } else {
        // Folder does not exist, create it
        const folderMetadata = {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [this.upgradeFolderId],
        };

        const newFolder = await this.drive.files.create({
          requestBody: folderMetadata,
          fields: 'id',
        });

        await this.drive.permissions.create({
          fileId: newFolder.data.id,
          requestBody: {
            role: 'reader', // Role for public access
            type: 'anyone', // Anyone, including people who aren't signed in
          },
        });

        this.logger.log(JSON.stringify(newFolder), 'create folder');
        return newFolder.data.id;
      }
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async upload(folderId: string, file: Express.Multer.File): Promise<any> {
    this.logger.log(folderId);
    try {
      const { buffer, mimetype, originalname } = file;

      const streamAbleFile = new StreamableFile(Buffer.from(buffer));
      const readStream = streamAbleFile.getStream();

      const res = await this.drive.files.create({
        requestBody: {
          name: originalname,
          mimeType: mimetype,
          parents: [folderId],
        },
        media: {
          mimeType: mimetype,
          body: readStream,
        },
      });
      return res;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async getCredentials(): Promise<any> {
    // const url = this.oauth2Client.generateAuthUrl({
    //   // 'online' (default) or 'offline' (gets refresh_token)
    //   access_type: 'offline',

    //   // If you only need one scope you can pass it as a string
    //   scope: ['https://www.googleapis.com/auth/drive'],
    // });
    // return url;

    const code =
      '4/0AfJohXmDxBqi6ZgAToB5XpFQHbB63AACeKHncCdcJr0XUZ8LWMW-ct7DSq5zqBwApOUEqQ';

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    return tokens;
  }
}
