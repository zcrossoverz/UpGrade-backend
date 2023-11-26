import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Course } from '../entities/course.entity';
import { IAnalysticRepository } from 'src/domain/repositories/analystRepository.interface';
import { Topic } from '../entities/topic.entity';
import { Unit } from '../entities/unit.entity';
import { Comment } from '../entities/comment.entity';

enum monthToString {
  'Jan' = 1,
  'Feb' = 2,
  'Mar' = 3,
  'Apr' = 4,
  'May' = 5,
  'Jun' = 6,
  'Jul' = 7,
  'Aug' = 8,
  'Sep' = 9,
  'Oct' = 10,
  'Nov' = 11,
  'Dec' = 12,
}

const getBetweenDate = (date: string) => {
  const [year, month] = date.split('-');
  const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
  const endDate = new Date(
    new Date(startDate).setUTCMonth(startDate.getUTCMonth() + 1) - 1,
  );
  return {
    startDate,
    endDate,
  };
};

@Injectable()
export class AnalyticRepository implements IAnalysticRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async getOverviewAnalytics(): Promise<any> {
    const date = new Date();
    date.toLocaleString('vn-VI', { timeZone: 'Asia/Ho_Chi_Minh' });

    // line chart
    const months: { value: string; key: string }[] = [];
    for (let i = -6; i <= 0; i++) {
      const month = date.getMonth() + 1 + i;
      const year = date.getFullYear();
      if (i < 0) {
        months.push({
          value: `${month < 1 ? year - 1 : year}-${(
            '0' + (month < 1 ? month + 12 : month).toString()
          ).slice(-2)}`,
          key: `${monthToString[month < 1 ? month + 12 : month]}`,
        });
      } else {
        months.push({
          value: `${month > 12 ? year + 1 : year}-${(
            '0' + (month > 12 ? month - 12 : month).toString()
          ).slice(-2)}`,
          key: `${monthToString[month > 12 ? month - 12 : month]}`,
        });
      }
    }

    const data = <any[]>[];
    await Promise.all(
      months.map(async (e, i) => {
        const { startDate, endDate } = getBetweenDate(e.value);
        const countCourse = await this.courseRepository
          .createQueryBuilder('course')
          .where('course.created_at BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .getCount();

        const countUnit = await this.unitRepository
          .createQueryBuilder()
          .where('created_at BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .getCount();

        const countTopic = await this.topicRepository
          .createQueryBuilder()
          .where('created_at BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
          })
          .getCount();
        return data.push({
          key: e.key,
          countCourse,
          countUnit,
          countTopic,
          index: i,
        });
      }),
    );

    const topEnrollment = await this.courseRepository.find({
      order: {
        members_count: 'DESC',
      },
      take: 10,
    });

    const topRate = await this.courseRepository
      .createQueryBuilder('course')
      .orderBy('CAST(course.rate AS float)', 'DESC', 'NULLS LAST')
      .take(10)
      .getMany();

    return {
      totalCourse: await this.courseRepository.count(),
      totalComment: await this.commentRepository.count(),
      totalReview: await this.reviewRepository.count(),
      topEnrollment,
      topRate,
      lineChart: data.sort((a, b) => a.index - b.index),
    };
  }
}
