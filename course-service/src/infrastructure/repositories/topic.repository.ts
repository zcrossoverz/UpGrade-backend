import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { RpcException } from '@nestjs/microservices';
import { ITopicRepository } from 'src/domain/repositories/topicRepository.interface';
import { Topic } from '../entities/topic.entity';
import { TopicM, typeStatusTopic } from 'src/domain/model/topic';
import { CourseProgress } from '../entities/courseProgress.entity';

@Injectable()
export class TopicRepository implements ITopicRepository {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(CourseProgress)
    private readonly progressRepository: Repository<CourseProgress>,
  ) {}
  async create(
    title: string,
    description: string,
    video_url: string,
    unit_id: number,
    duration: number,
    file_id: string,
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
        file_id,
      }),
    );
  }
  async getTopic(topic_id: number, user_id: number): Promise<TopicM> {
    if (!topic_id) {
      throw new RpcException(new BadRequestException('topic id is required'));
    }
    const result = await this.topicRepository.findOne({
      where: { id: topic_id },
      relations: {
        unit: {
          course: true,
        },
      },
    });
    const course = result.unit.course;
    const progress = await this.progressRepository.findOne({
      where: {
        course: {
          id: course.id,
        },
        user_id,
      },
    });
    progress.currentTopic = result;
    this.progressRepository.save(progress);
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

  async getFolderDriveId(unit_id: number) {
    const result = await this.unitRepository.findOne({
      where: {
        id: unit_id,
      },
    });

    return result.drive_folder_unit_id;
  }
  async update(
    id: number,
    title: string,
    description: string,
    status: typeStatusTopic,
  ): Promise<boolean> {
    const result = await this.topicRepository.update(
      {
        id,
      },
      {
        title,
        description,
        status,
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
