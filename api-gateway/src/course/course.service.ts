import { Injectable, Inject } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { COURSE_MESSAGE_PATTERNS } from './messagePattern';
import { ClientProxy } from '@nestjs/microservices';
import { GDrive } from 'src/common/gdrive/gdrive';
import * as crypto from 'crypto';

@Injectable()
export class CourseService {
  constructor(
    @Inject('COURSE_SERVICE') private readonly client: ClientProxy,
    private readonly gdrive: GDrive,
  ) {}

  async create(createCourseDto: CreateCourseDto, files: any) {
    const thumbnail = files.thumbnail[0];

    const folderName = `${crypto.randomUUID()}_${new Date().getTime()}`;
    const folder = await this.gdrive.createFolderIfNotExist(folderName);

    const nameThumbnail = 'thumbnail.png';

    const uploadThumbnail = await this.gdrive.upload(
      folder,
      thumbnail,
      nameThumbnail,
    );
    const fileId = uploadThumbnail.data.id;
    const thumbnailUrl = await this.gdrive.getContentLink(fileId);

    return this.client.send(COURSE_MESSAGE_PATTERNS.create, {
      ...createCourseDto,
      thumbnail: thumbnailUrl,
    });
  }

  getList() {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getList, {});
  }

  findOne(id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getOne, { id });
  }

  upload() {
    return this.client.send(COURSE_MESSAGE_PATTERNS.uploadVideo, {});
  }
}
