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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
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

    return this.courseService.create(createCourseDto, files);
  }

  @Post('/upload')
  upload() {
    return this.courseService.upload();
  }

  @Get('')
  findAll() {
    return this.courseService.getList();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOne(id);
  }
}
