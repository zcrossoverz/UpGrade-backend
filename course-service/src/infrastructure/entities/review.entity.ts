import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;

  @Column()
  comment: string;

  @Column()
  rate: number;

  @Column()
  reviewer_id: number;

  @Column()
  course_id: number;

  @Column()
  reviewer_fullname: string;

  @Column({ nullable: true })
  reviewer_avatar: string;

  @Column()
  reviewer_email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
