import { UnitM } from '../model/unit';

export interface IUnitRepository {
  create(title: string, course_id: number): Promise<UnitM>;
  update(unit_id: number, title: string): Promise<boolean>;
  delete(unit_id: number): Promise<boolean>;
}
