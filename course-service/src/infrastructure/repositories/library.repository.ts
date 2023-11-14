import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CourseProgress } from '../entities/courseProgress.entity';
import { IfilterSearch } from 'src/domain/constant/constant';
import { ILibraryRepository } from 'src/domain/repositories/libraryRepository.interface';
import { Library } from '../entities/library.entity';
import { LibraryM } from 'src/domain/model/library';

@Injectable()
export class LibraryRepository implements ILibraryRepository {
  constructor(
    @InjectRepository(Library)
    private readonly repository: Repository<Library>,
    @InjectRepository(CourseProgress)
    private readonly courseProgressRepository: Repository<CourseProgress>,
  ) {}

  async add(user_id: number, course_progress_id: number): Promise<any> {
    if (!user_id || !course_progress_id) {
      throw new RpcException(
        new BadRequestException('user id and course progress id is required'),
      );
    }

    const courseProgress = await this.courseProgressRepository.findOne({
      where: {
        id: course_progress_id,
      },
    });

    if (!courseProgress) {
      throw new RpcException(
        new BadRequestException('course progress not found'),
      );
    }

    const library = await this.repository.findOne({
      where: {
        user_id,
      },
      relations: {
        courses: true,
      },
    });

    if (!library) {
      return await this.repository.save(
        this.repository.create({
          user_id,
          courses: [courseProgress],
        }),
      );
    }

    library.courses.push(courseProgress);
    const result = await this.repository.save(library);

    return result;
  }

  async update(id: number, data: any): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.update(id, { ...data });
    return result.affected > 0;
  }
  async delete(id: number): Promise<boolean> {
    if (!id) {
      throw new RpcException(new BadRequestException('id is required'));
    }
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
  async getList(
    filter: IfilterSearch,
  ): Promise<{ datas: LibraryM[]; count: number }> {
    const { limit = 5, page = 1, order, query, exclude } = filter;

    const offset = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (query) {
      query.forEach(({ key, value }) => {
        where[key] = ILike(`%${value}%`);
      });
    }

    if (exclude) {
      exclude.forEach(({ key, value }) => {
        where[key] = Not(value);
      });
    }

    const [datas, count] = await this.repository.findAndCount({
      where,
      ...(order ? { order: { [order.key]: order.value } } : {}),
      take: limit,
      skip: offset,
    });

    return {
      datas,
      count,
    };
  }
  async get(user_id: number): Promise<LibraryM> {
    const result = await this.repository.findOne({
      where: {
        user_id,
      },
    });
    return result;
  }
}
