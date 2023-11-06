import { typeStatusCourse } from 'src/domain/model/course';
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
import { Category } from './category.entity';
import { Unit } from './unit.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  instructor_id: number;

  @Column()
  price: number;

  @Column()
  thumbnail_url: string;

  @Column()
  status: typeStatusCourse;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'category' })
  category: Category;

  @OneToMany(() => Unit, (unit) => unit.course)
  units: Unit[];
}
