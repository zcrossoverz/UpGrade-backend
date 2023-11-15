import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { IfilterSearch } from 'src/domain/constant/constant';
import { Note } from '../entities/note.entity';
import { INoteRepository } from 'src/domain/repositories/noteRepository.interface';
import { Topic } from '../entities/topic.entity';
import { NoteM } from 'src/domain/model/note';

@Injectable()
export class NoteRepository implements INoteRepository {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async create(
    user_id: number,
    comment: string,
    time: number,
    topic_id: number,
  ): Promise<NoteM> {
    if (!user_id || !comment || !time || !topic_id) {
      throw new RpcException(
        new BadRequestException('user id, comment, time, topic id is required'),
      );
    }
    const topic = await this.topicRepository.findOne({
      where: {
        id: topic_id,
      },
    });
    if (!topic) {
      throw new RpcException(new BadRequestException('topic not found'));
    }
    const result = await this.repository.save(
      this.repository.create({
        user_id,
        topic,
        comment,
        time,
        topic_id,
      }),
    );

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
  ): Promise<{ datas: NoteM[]; count: number }> {
    const { limit = 5, page = 1, order, query, exclude, explicit } = filter;

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

    if (explicit) {
      explicit.forEach(({ key, value }) => {
        where[key] = value;
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
  async get(id: number): Promise<NoteM> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
