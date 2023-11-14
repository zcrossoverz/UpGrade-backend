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
import { Unit } from './unit.entity';
import { typeStatusTopic } from 'src/domain/model/topic';
import { Note } from './note.entity';
import { Comment } from './comment.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  video_url: string;

  @Column()
  duration: number;

  @Column()
  description: string;

  @Column()
  file_id: string;

  @ManyToOne(() => Unit, (unit) => unit.topics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @Column({
    enum: typeStatusTopic,
    default: typeStatusTopic.PRIVATE,
  })
  status: typeStatusTopic;

  @OneToMany(() => Note, (note) => note.topic)
  notes: Note[];

  @OneToMany(() => Comment, (comment) => comment.topic)
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
