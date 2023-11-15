import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { ReviewService } from './review.service';
import { IfilterSearch } from 'src/common/interface/filterSearch';

@Controller('review')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  createReview(
    @Request() request,
    @Body()
    data: {
      course_id: number;
      rate: number;
      comment: string;
    },
  ) {
    const { user } = request;
    return this.service.create(
      user.id,
      data.course_id,
      user.email,
      user.avatar,
      `${user.firstName} ${user.lastName}`,
      data.rate,
      data.comment,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/update')
  update(@Body() data: { id: number; rate?: number; comment?: string }) {
    const { id, rate, comment } = data;
    return this.service.update(id, rate, comment);
  }

  @UseGuards(AuthGuard)
  @Post('/delete')
  delete(@Body() data: { id: number }) {
    const { id } = data;
    return this.service.deleteReview(id);
  }

  @Post('/get-list')
  getList(@Body() data: IfilterSearch) {
    return this.service.getList(data);
  }
}
