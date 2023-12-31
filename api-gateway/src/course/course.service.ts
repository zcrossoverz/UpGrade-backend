import { Injectable, Inject } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import {
  APPROVAL_REQUEST_MESSAGE_PATTERNS,
  COURSE_MESSAGE_PATTERNS,
} from './messagePattern';
import { ClientProxy } from '@nestjs/microservices';
import { GDrive } from 'src/common/gdrive/gdrive';
import * as crypto from 'crypto';
import { IfilterSearch } from 'src/common/interface/filterSearch';

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

  getList(filter) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getList, {
      ...filter,
    });
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

  submitApprovalRequest(
    instructor_id: number,
    course_id: number,
    instructor_username: string,
  ) {
    return this.client.send(
      APPROVAL_REQUEST_MESSAGE_PATTERNS.submitApprovalRequest,
      {
        instructor_id,
        course_id,
        instructor_username,
      },
    );
  }

  processApprovalRequest(
    approver_id: number,
    id: number,
    status: enumApprovalStatus,
    approver_fullname: string,
  ) {
    return this.client.send(
      APPROVAL_REQUEST_MESSAGE_PATTERNS.processApprovalRequest,
      {
        approver_id,
        id,
        status,
        approver_fullname,
      },
    );
  }

  getListApprovalRequest(filter: IfilterSearch) {
    return this.client.send(
      APPROVAL_REQUEST_MESSAGE_PATTERNS.getListApprovalRequest,
      {
        ...filter,
      },
    );
  }

  updateCourse(
    course_id: number,
    data: {
      description?: string;
      price?: number;
      status?: string;
    },
  ) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.update, {
      course_id,
      data,
    });
  }

  enrollCourse(course_id: number, user_id: number, user_fullname: string) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.enroll, {
      course_id,
      user_id,
      user_fullname,
    });
  }

  getLibrary(user_id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getLibrary, {
      user_id,
    });
  }

  getRecommend(user_id: number) {
    return this.client.send(COURSE_MESSAGE_PATTERNS.getRecommend, {
      user_id,
    });
  }
}
