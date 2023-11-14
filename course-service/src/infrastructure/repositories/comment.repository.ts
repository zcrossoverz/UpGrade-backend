import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { ICommentRepository } from 'src/domain/repositories/comment.interface';
import { Comment, enumCommentRole } from '../entities/comment.entity';
import { Topic } from '../entities/topic.entity';
import { IfilterSearch } from 'src/domain/constant/constant';
import { CommentM } from 'src/domain/model/comment';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async create(
    user_id: number,
    user_fullname: string,
    user_avatar: string,
    user_role: enumCommentRole,
    topic_id: number,
    parent_id?: number,
  ): Promise<CommentM> {
    if (!user_id || !user_fullname || !user_avatar || !user_role || !topic_id) {
      throw new RpcException(
        new BadRequestException('field required cannot empty'),
      );
    }

    const topic = await this.topicRepository.findOne({
      where: {
        id: topic_id,
      },
    });

    if (topic) {
      throw new RpcException(new BadRequestException('topic not found'));
    }

    const result = await this.repository.save(
      this.repository.create({
        user_id,
        user_avatar,
        user_fullname,
        user_role,
        topic,
        ...(parent_id !== undefined
          ? {
              parent: await this.repository.findOne({
                where: {
                  id: parent_id,
                },
              }),
            }
          : {}),
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
  ): Promise<{ datas: CommentM[]; count: number }> {
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
  async get(id: number): Promise<CommentM> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
