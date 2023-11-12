import { ROLE } from 'src/domain/model/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
