import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { ICommentRepository } from 'src/domain/repositories/commentRepository.interface';
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
    topic_id: number,
    user_id: number,
    user_avatar: string,
    user_fullname: string,
    user_email: string,
    user_role: enumCommentRole,
    text: string,
    parent_id?: number,
  ): Promise<CommentM> {
    if (
      !user_id ||
      !user_fullname ||
      !user_role ||
      !topic_id ||
      !user_email ||
      !text
    ) {
      throw new RpcException(
        new BadRequestException('field required cannot empty'),
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
        user_avatar,
        user_fullname,
        user_role,
        user_email,
        topic,
        topic_id,
        text,
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

    if (parent_id) {
      const parent = await this.repository.findOne({
        where: {
          id: parent_id,
        },
      });

      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(result);
        this.repository.save(parent);
      }
    }

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

  async react(id: number, isLike: boolean, user_id: number): Promise<boolean> {
    if (!id || isLike === undefined) {
      throw new RpcException(new BadRequestException('field missing'));
    }
    const comment = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!comment)
      throw new RpcException(new BadRequestException('comment not found'));

    comment.likes = comment.likes || [];
    comment.dislikes = comment.dislikes || [];

    if (isLike) {
      if (comment.likes.some((e) => Number(e) === user_id)) {
        comment.likes = comment.likes.filter((e) => Number(e) !== user_id);
        this.repository.save(comment);
        return true;
      }

      comment.likes.push(user_id);
      comment.dislikes = comment.dislikes.filter((e) => Number(e) !== user_id);
      this.repository.save(comment);
    } else {
      if (comment.dislikes.some((e) => Number(e) === user_id)) {
        comment.dislikes = comment.dislikes.filter(
          (e) => Number(e) !== user_id,
        );
        this.repository.save(comment);
        return true;
      }
      comment.dislikes.push(user_id);
      comment.likes = comment.likes.filter((e) => Number(e) !== user_id);
      this.repository.save(comment);
    }
    return true;
  }

  async getList(
    filter: IfilterSearch,
  ): Promise<{ datas: CommentM[]; count: number }> {
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
      relations: {
        parent: true,
        children: true,
      },
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
      relations: {
        parent: true,
        children: true,
      },
    });
    return result;
  }
}
