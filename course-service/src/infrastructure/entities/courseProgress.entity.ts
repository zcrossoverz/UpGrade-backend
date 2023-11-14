import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Topic } from './topic.entity';

@Entity()
export class CourseProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => Course, (course) => course.id)
  @JoinColumn()
  course: Course;

  @ManyToOne(() => Topic, (topic) => topic, { nullable: true })
  @JoinColumn()
  currentTopic: Topic;

  @ManyToMany(() => Topic, { nullable: true })
  @JoinTable()
  topicCompleted: Topic[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
