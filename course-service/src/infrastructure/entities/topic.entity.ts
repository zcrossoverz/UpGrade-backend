import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit } from './unit.entity';

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

  @ManyToOne(() => Unit, (unit) => unit.topics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
