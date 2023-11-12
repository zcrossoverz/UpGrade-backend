export enum enumApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export class ApprovalRequestM {
  id: number;
  course_id: number;
  instructor_id: number;
  course_title: string;
  instructor_username: string;
  status: enumApprovalStatus;
  approver_id: number;
  approver_fullname: string;
  created_at: Date;
  updated_at: Date;
}
