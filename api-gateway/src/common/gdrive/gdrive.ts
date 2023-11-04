import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';

@Injectable()
export class GDrive {
  private readonly oauth2Client: any;

  private readonly drive: drive_v3.Drive;

  private readonly logger = new Logger('GDrive');

  private readonly upgradeFolderId: string;

  constructor(private readonly config: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.config.get<string>('gdrive.clientID'),
      this.config.get<string>('gdrive.clientSecret'),
      this.config.get<string>('gdrive.redirectURL'),
    );

    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });

    this.upgradeFolderId = this.config.get<string>('gdrive.mainFolderId');

    this.oauth2Client.setCredentials({
      access_token: this.config.get<string>('gdrive.accessToken'),
      refresh_token: this.config.get<string>('gdrive.refreshToken'),
      scope: 'https://www.googleapis.com/auth/drive',
    });
  }
  async getFileId(fileName: string): Promise<any> {
    try {
      const query = `name='${fileName}'`;
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
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${this.config.get<string>(
      'gdrive.apikey',
    )}`;
  }
  async createFolderIfNotExist(folderName: string): Promise<any> {
    try {
      // Check if the folder exists
      const folderQuery = `'${this.upgradeFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder'`;
      const existingFolders = await this.drive.files.list({
        q: folderQuery,
      });

      if (existingFolders.data.files.length > 0) {
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
        return newFolder.data.id;
      }
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async upload(
    folderId: string,
    file: Express.Multer.File,
    name?: string,
  ): Promise<any> {
    try {
      const { buffer, mimetype, originalname } = file;

      const streamAbleFile = new StreamableFile(Buffer.from(buffer));
      const readStream = streamAbleFile.getStream();

      const res = await this.drive.files.create({
        requestBody: {
          name: name || originalname,
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
      return error;
    }
  }

  async uploadVideoResumable(folderId: string, name: string, file: any) {
    try {
      const streamAbleFile = new StreamableFile(Buffer.from(file.buffer));
      const readStream = streamAbleFile.getStream();

      const request = await this.drive.files.create(
        {
          requestBody: {
            name: name,
            parents: [folderId],
          },
          media: {
            mimeType: 'video/mp4',
            body: readStream,
          },
          fields: 'id',
        },
        {
          // Use the resumable option
          onUploadProgress: (evt) => {
            // Log the progress
            const progress = (evt.bytesRead / file.buffer.length) * 100;
            console.log(`${progress}% completed`);
          },
        },
      );
      return request.data.id;
    } catch (error) {
      return error;
    }
  }

  async getWebviewLink(fileId: string): Promise<any> {
    const file = await this.drive.files.get({
      fileId,
      fields: 'webViewLink',
    });

    const webViewLink = file.data.webViewLink;
    return webViewLink;
  }

  async getContentLink(fileId: string): Promise<any> {
    const file = await this.drive.files.get({
      fileId,
      fields: 'webContentLink',
    });

    const webContentLink = file.data.webContentLink;
    return webContentLink;
  }

  async getCode(): Promise<any> {
    const url = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      // If you only need one scope you can pass it as a string
      scope: ['https://www.googleapis.com/auth/drive'],
    });
    return url;
  }

  async getCredentials(): Promise<any> {
    const code =
      '4/0AfJohXkrY3b9yraYsJX5PoQBV5VvxoqVQbalEYISq_0xaYwI-1VuwsXYurS0l4X1Vguj4w';

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    return tokens;
  }
}
