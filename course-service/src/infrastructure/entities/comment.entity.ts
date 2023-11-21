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

  @Column({
    nullable: true,
  })
  user_avatar: string;

  @Column()
  user_email: string;

  @Column()
  user_role: enumCommentRole;

  @Column()
  topic_id: number;

  @ManyToOne(() => Topic, (topic) => topic.comments, { onDelete: 'CASCADE' })
  topic: Topic;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  parent: Comment;

  @OneToMany(() => Comment, (child) => child.parent, {
    nullable: true,
    onDelete: 'CASCADE',
  })
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
