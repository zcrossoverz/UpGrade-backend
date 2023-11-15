import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { NotificationService } from './notification.service';

@Controller('notify')
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Post('/get-unread')
  getUnread(@Request() request) {
    const { user } = request;
    return this.notiService.getListUnread(user.id);
  }

  @UseGuards(AuthGuard)
  @Post('/mark-read')
  update(@Body() data: { id?: number }, @Request() request) {
    const { id } = data;
    const { user } = request;

    return this.notiService.markRead(user.id, id);
  }
}
