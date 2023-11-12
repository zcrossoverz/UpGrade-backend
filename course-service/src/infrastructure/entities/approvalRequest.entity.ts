import { enumApprovalStatus } from 'src/domain/model/approvalRequest';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ApprovalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instructor_id: number;

  @Column()
  course_id: number;

  @Column({ nullable: true })
  course_title: string;

  @Column({ nullable: true })
  approver_fullname: string;

  @Column({ nullable: true })
  instructor_username: string;

  @Column({
    nullable: true,
  })
  approver_id: number;

  @Column({
    enum: enumApprovalStatus,
    default: enumApprovalStatus.PENDING,
  })
  status: enumApprovalStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
