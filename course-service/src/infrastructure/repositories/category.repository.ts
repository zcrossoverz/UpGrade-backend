import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICategoryRepository } from 'src/domain/repositories/categoryRepository.interface';
import { CategoryM } from 'src/domain/model/category';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(name: string, description: string): Promise<CategoryM> {
    const result = await this.categoryRepository.save(
      this.categoryRepository.create({
        name,
        description,
      }),
    );
    return result;
  }
  async update(
    id: number,
    name: string,
    description: string,
  ): Promise<boolean> {
    const result = await this.categoryRepository.update(id, {
      name,
      description,
    });
    return result.affected > 0;
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected > 0;
  }
  async getList(): Promise<{ datas: CategoryM[]; count: number }> {
    const [datas, count] = await this.categoryRepository.findAndCount({});
    return {
      datas,
      count,
    };
  }
}
