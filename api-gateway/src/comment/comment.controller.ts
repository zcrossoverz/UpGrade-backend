import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { CommentService } from './comment.service';
import { IfilterSearch } from 'src/common/interface/filterSearch';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  getUnread(
    @Request() request,
    @Body()
    data: {
      topic_id: number;
      text: string;
      parent_id?: number;
    },
  ) {
    const { user } = request;
    return this.service.create(
      data.topic_id,
      user.id,
      user.avatar,
      user.firstName + ' ' + user.lastName,
      user.email,
      user.role,
      data.text,
      data.parent_id,
    );
  }

  @Post('/get-list')
  getList(@Body() data: IfilterSearch) {
    return this.service.getList(data);
  }

  @UseGuards(AuthGuard)
  @Post('/delete')
  delete(@Body() data: { id: number }) {
    const { id } = data;
    return this.service.delete(id);
  }

  @UseGuards(AuthGuard)
  @Post('/react')
  react(@Body() data: { id: number; isLike: boolean }, @Request() request) {
    const { id, isLike } = data;
    const { user } = request;
    return this.service.react(id, isLike, user.id);
  }

  @UseGuards(AuthGuard)
  @Post('/update')
  update(@Body() data: { id: number; text: string }) {
    const { id, text } = data;
    return this.service.update(id, text);
  }
}
