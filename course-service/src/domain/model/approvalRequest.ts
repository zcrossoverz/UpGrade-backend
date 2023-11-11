export enum enumApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export class ApprovalRequestM {
  id: number;
  course_id: number;
  instructor_id: number;
  status: enumApprovalStatus;
  approver_id: number;
  created_at: Date;
  updated_at: Date;
}
