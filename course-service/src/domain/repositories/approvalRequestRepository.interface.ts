import { ApprovalRequestM } from '../model/approvalRequest';

export interface IApprovalRequestRepository {
  create(
    instructor_id: number,
    course_id: number,
    instructor_username: string,
  ): Promise<ApprovalRequestM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(): Promise<{ datas: ApprovalRequestM[]; count: number }>;
  get(id: number): Promise<ApprovalRequestM>;
}
