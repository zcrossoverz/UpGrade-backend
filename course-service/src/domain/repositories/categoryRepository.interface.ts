import { CategoryM } from '../model/category';

export interface ICategoryRepository {
  create(name: string, description: string): Promise<CategoryM>;
  update(id: number, name: string, description: string): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getList(): Promise<{ datas: CategoryM[]; count: number }>;
}
