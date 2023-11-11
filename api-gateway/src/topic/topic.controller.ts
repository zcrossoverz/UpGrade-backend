import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { TopicService } from './topic.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]))
  create(
    @Body()
    createDto: {
      title: string;
      description: string;
      unit_id: number;
      drive_folder_unit_id: string;
    },
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
    },
  ) {
    return this.topicService.create(createDto, files);
  }

  @Post('/update')
  update(
    @Body() updateDto: { topic_id: number; title: string; description: string },
  ) {
    return this.topicService.update(updateDto);
  }

  @Post('/delete/:id')
  delete(@Param('id') id: number) {
    return this.topicService.delete(id);
  }

  @Post('/get/:id')
  getOne(@Param('id') id: number) {
    return this.topicService.getOne(id);
  }

  @Post('/get-list-topic')
  getListUnit(@Body() query: { unit_id: number }) {
    return this.topicService.getList(query);
  }

  @Get('/get_code')
  getCodeDrive() {
    return this.topicService.getCodeDrive();
  }
  @Get('/get_cre')
  getCreDrive() {
    return this.topicService.getCredentials();
  }
}
