import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { AuthGuard } from 'src/common/guards/auth';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  create(@Body() createCourseDto: CreateCourseDto, @Request() request) {
    const { user } = request;
    createCourseDto.instructor_id = user.id;
    return this.courseService.create(createCourseDto);
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
