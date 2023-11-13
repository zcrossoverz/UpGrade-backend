import { typeStatusCourse } from 'src/domain/model/course';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Unit } from './unit.entity';
import { Member } from './member.entity';

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

  @Column({ nullable: true })
  instructor_fullname: string;

  @Column()
  price: number;

  @Column()
  thumbnail_url: string;

  @Column()
  drive_folder_id: string;

  @Column()
  members_count: number;

  @Column({ type: 'simple-array', nullable: true })
  members_id: number[];

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

  @ManyToMany(() => Member)
  @JoinTable()
  members: Member[];
}
