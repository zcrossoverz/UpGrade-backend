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
import { Library } from './library.entity';

@Entity()
export class CourseProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  course_id: number;

  @ManyToOne(() => Course, (course) => course.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  course: Course;

  @ManyToOne(() => Topic, (topic) => topic, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currentTopic: Topic;

  @ManyToOne(() => Library, (library) => library.courses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  library: Library;

  @ManyToMany(() => Topic, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable()
  topicCompleted: Topic[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
