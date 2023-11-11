import { Injectable, Inject } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import {
  APPROVAL_REQUEST_MESSAGE_PATTERNS,
  COURSE_MESSAGE_PATTERNS,
} from './messagePattern';
import { ClientProxy } from '@nestjs/microservices';
import { GDrive } from 'src/common/gdrive/gdrive';
import * as crypto from 'crypto';

enum enumApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Injectable()
export class CourseService {
  constructor(
    @Inject('COURSE_SERVICE') private readonly client: ClientProxy,
    private readonly gdrive: GDrive,
  ) {}

  async create(createCourseDto: CreateCourseDto, files: any) {
    const thumbnail = files.thumbnail[0];

    const folderName = `${
      createCourseDto.title
    }_${new Date().getTime()}_${crypto.randomUUID()}`;
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
      drive_folder_id: folder,
      thumbnail: thumbnailUrl,
    });
  }

  getList() {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getList, {});
  }

  findOne(id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getOne, { id });
  }

  async upload(files: any) {
    const folder = await this.gdrive.createFolderIfNotExist('test video');
    const file = files.video[0];

    const fileId = await this.gdrive.uploadVideoResumable(
      folder,
      'test video 2',
      file,
    );
    const link = await this.gdrive.getLinkVideo(fileId);
    return link;
  }

  getMyCourses(instructor_id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getMyCourses, {
      instructor_id,
    });
  }

  async deleteCourse(course_id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.delete, { course_id });
  }

  submitApprovalRequest(instructor_id: number, course_id: number) {
    return this.client.send(
      APPROVAL_REQUEST_MESSAGE_PATTERNS.submitApprovalRequest,
      {
        instructor_id,
        course_id,
      },
    );
  }

  processApprovalRequest(
    approver_id: number,
    id: number,
    status: enumApprovalStatus,
  ) {
    return this.client.send(
      APPROVAL_REQUEST_MESSAGE_PATTERNS.processApprovalRequest,
      {
        approver_id,
        id,
        status,
      },
    );
  }

  getListApprovalRequest() {
    return this.client.send(
      APPROVAL_REQUEST_MESSAGE_PATTERNS.getListApprovalRequest,
      {},
    );
  }
}
