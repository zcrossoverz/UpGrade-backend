import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Topic } from './topic.entity';
import { typeStatusUnit } from 'src/domain/model/unit';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Course, (course) => course.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Topic, (topic) => topic.unit)
  topics: Topic[];

  @Column()
  drive_folder_unit_id: string;

  @Column({
    enum: typeStatusUnit,
    default: typeStatusUnit.PRIVATE,
  })
  status: typeStatusUnit;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
