import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { RpcException } from '@nestjs/microservices';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';
import { Topic } from '../entities/topic.entity';
import { TopicM } from 'src/domain/model/topic';

@Injectable()
export class TopicRepository implements ITopicRepository {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}
  async create(
    title: string,
    description: string,
    video_url: string,
    unit_id: number,
    duration: number,
  ): Promise<TopicM> {
    if (!title) {
      throw new RpcException(new BadRequestException('title is required'));
    }
    if (!description) {
      throw new RpcException(new BadRequestException('desc is required'));
    }
    if (!video_url) {
      throw new RpcException(new BadRequestException('video is required'));
    }
    if (!unit_id) {
      throw new RpcException(new BadRequestException('unit id is required'));
    }

    const unit = await this.unitRepository.findOneBy({
      id: unit_id,
    });

    return this.topicRepository.save(
      this.topicRepository.create({
        title,
        description,
        video_url,
        unit,
        duration,
      }),
    );
  }
  async getTopic(topic_id: number): Promise<TopicM> {
    if (!topic_id) {
      throw new RpcException(new BadRequestException('topic id is required'));
    }
    const result = await this.topicRepository.findOneBy({ id: topic_id });
    return result;
  }
  async getListTopic(
    unit_id: number,
  ): Promise<{ datas: TopicM[]; count: number }> {
    if (!unit_id) {
      throw new RpcException(new BadRequestException('unit id is required'));
    }
    const [datas, count] = await this.topicRepository.findAndCount({
      where: {
        unit: {
          id: unit_id,
        },
      },
    });
    return {
      datas,
      count,
    };
  }
  async update(
    id: number,
    title: string,
    description: string,
  ): Promise<boolean> {
    const result = await this.topicRepository.update(
      {
        id,
      },
      {
        title,
        description,
      },
    );
    return result.affected > 0;
  }
  async delete(topic_id: number): Promise<boolean> {
    const result = await this.topicRepository.delete({
      id: topic_id,
    });
    return result.affected > 0;
  }
}
