import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUnitRepository } from 'src/domain/repositories/unitRepository.interface';
import { Unit } from '../entities/unit.entity';
import { UnitM } from 'src/domain/model/unit';
import { RpcException } from '@nestjs/microservices';
import { Course } from '../entities/course.entity';

@Injectable()
export class UnitRepository implements IUnitRepository {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async create(
    title: string,
    course_id: number,
    drive_folder_unit_id: string,
  ): Promise<UnitM> {
    if (!course_id) {
      throw new RpcException(new BadRequestException('course_id is required'));
    }
    if (!title) {
      throw new RpcException(new BadRequestException('title is required'));
    }
    const course = await this.courseRepository.findOneBy({ id: course_id });

    if (!course) {
      throw new RpcException(new BadRequestException('course not found'));
    }

    const result = this.unitRepository.save(
      this.unitRepository.create({
        title,
        course,
        drive_folder_unit_id,
      }),
    );

    return result;
  }
  async update(unit_id: number, title: string, status): Promise<boolean> {
    const result = await this.unitRepository.update(
      {
        id: unit_id,
      },
      {
        title,
        status,
      },
    );
    return result.affected > 0;
  }
  async delete(unit_id: number): Promise<boolean> {
    const result = await this.unitRepository.delete({
      id: unit_id,
    });
    return result.affected > 0;
  }
}
