import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { AuthGuard } from 'src/common/guards/auth';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'thumbnail', maxCount: 1 }]))
  create(
    @Body() createCourseDto: CreateCourseDto,
    @Request() request,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
    },
  ) {
    const { user } = request;
    createCourseDto.instructor_id = user.id;
    createCourseDto.instructor_fullname = user.firstName + ' ' + user.lastName;

    return this.courseService.create(createCourseDto, files);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]))
  @Post('/upload')
  upload(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
    },
  ) {
    return this.courseService.upload(files);
  }

  @UseGuards(AuthGuard)
  @Post('/get-my-courses')
  getMyCourses(@Request() request) {
    const { user } = request;
    return this.courseService.getMyCourses(user.id);
  }

  @UseGuards(AuthGuard)
  @Post('/update')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'thumbnail', maxCount: 1 }]))
  update(
    @Body()
    data: {
      description: string;
      price: number;
      status: string;
      course_id: number;
    },
  ) {
    return this.courseService.updateCourse(data.course_id, { ...data });
  }

  @Post('/get-list')
  findAll(@Body() data) {
    return this.courseService.getList(data);
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOne(id);
  }

  @Post('/submit-approval')
  @UseGuards(AuthGuard)
  submitApproval(
    @Request() request,
    @Body()
    data: {
      course_id: number;
    },
  ) {
    const { user } = request;
    return this.courseService.submitApprovalRequest(
      user.id,
      data.course_id,
      user.firstName + ' ' + user.lastName,
    );
  }

  @Post('/process-approval')
  @UseGuards(AuthGuard)
  processApproval(
    @Request() request,
    @Body()
    data: {
      id: number;
      status: any;
    },
  ) {
    const { user } = request;
    return this.courseService.processApprovalRequest(
      user.id,
      data.id,
      data.status,
      `${user.firstName} ${user.lastName}`,
    );
  }

  @Post('/get-approval-list')
  getApprovalList() {
    return this.courseService.getListApprovalRequest();
  }

  @Post('/delete/:id')
  deleteCourse(@Param('id') id: number) {
    return this.courseService.deleteCourse(id);
  }

  @Post('/enroll')
  @UseGuards(AuthGuard)
  enrollCourse(
    @Request() request,
    @Body()
    data: {
      course_id: number;
    },
  ) {
    const { user } = request;
    return this.courseService.enrollCourse(data.course_id, user.id);
  }

  @Post('/get-library')
  @UseGuards(AuthGuard)
  getLibrary(@Request() request) {
    const { user } = request;
    return this.courseService.getLibrary(user.id);
  }
}
