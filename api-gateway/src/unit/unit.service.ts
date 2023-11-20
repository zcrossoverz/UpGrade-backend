import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UNIT_MESSAGE_PATTERNS } from './messagePattern';
import { GDrive } from 'src/common/gdrive/gdrive';

@Injectable()
export class UnitService {
  constructor(
    @Inject('UNIT_SERVICE') private readonly client: ClientProxy,
    private readonly gdrive: GDrive,
  ) {}

  async create(createDto: {
    title: string;
    course_id: number;
    drive_folder_id: string;
  }) {
    const folderName = createDto.title;
    const folder = await this.gdrive.createFolderIfNotExist(
      folderName,
      createDto.drive_folder_id,
    );

    return this.client.send(UNIT_MESSAGE_PATTERNS.create, {
      ...createDto,
      drive_folder_unit_id: folder,
    });
  }

  async update(title: string, unit_id: number, status: string) {
    return this.client.send(UNIT_MESSAGE_PATTERNS.update, {
      title,
      unit_id,
      status,
    });
  }

  async delete(id: number) {
    return this.client.send(UNIT_MESSAGE_PATTERNS.delete, { id });
  }
}
