import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  getUnread(
    @Request() request,
    @Body()
    data: {
      comment: string;
      time: number;
      topic_id: number;
    },
  ) {
    const { user } = request;
    return this.service.add(user.id, data.comment, data.time, data.topic_id);
  }

  @UseGuards(AuthGuard)
  @Post('/get-list-by-topic')
  getListByTopic(@Body() data: { topic_id: number }, @Request() request) {
    const { topic_id } = data;
    const { user } = request;

    return this.service.getList({
      explicit: [
        {
          key: 'user_id',
          value: user.id,
        },
        {
          key: 'topic_id',
          value: topic_id,
        },
      ],
    });
  }

  @UseGuards(AuthGuard)
  @Post('/delete')
  delete(@Body() data: { id: number }) {
    const { id } = data;

    return this.service.delete(id);
  }
}
