import { IfilterSearch } from '../constant/constant';
import { ReviewM } from '../model/review';

export interface IReviewRepository {
  create(
    course_id: number,
    rate: number,
    comment: string,
    user_id: number,
    user_fullname: string,
    user_avatar: string,
    user_email: string,
  ): Promise<ReviewM>;
  update(id: number, data: any): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(filter: IfilterSearch): Promise<{ datas: ReviewM[]; count: number }>;
  get(id: number): Promise<ReviewM>;
}
