import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

export enum enumCommentRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  user_id: number;

  @Column()
  user_fullname: string;

  @Column()
  user_avatar: string;

  @Column()
  user_role: enumCommentRole;

  @ManyToOne(() => Topic, (topic) => topic.comments)
  topic: Topic;

  @ManyToOne(() => Comment, { nullable: true })
  parent: Comment;

  @OneToMany(() => Comment, (child) => child.parent, { nullable: true })
  children: Comment[];

  @Column({ type: 'simple-array', nullable: true })
  likes: number[];

  @Column({ type: 'simple-array', nullable: true })
  dislikes: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}