import { Controller, Inject, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateCategoryUseCases } from 'src/usecases/category/createCategory';
import { UpdateCategoryUseCases } from 'src/usecases/category/updateCategory';
import { DeleteCategoryUseCases } from 'src/usecases/category/deleteCategory';
import { GetListCategoryUseCases } from 'src/usecases/category/getListCategory';
import { CATEGORY_MESSAGE_PATTERNS } from './messagePattern';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { AnalystCategoryUseCases } from 'src/usecases/category/analytic';

@Controller('category')
export class CategoryController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_CATEGORY_USECASES_PROXY)
    private readonly createUsecase: UseCaseProxy<CreateCategoryUseCases>,
    @Inject(UsecasesProxyModule.UPDATE_CATEGORY_USER_USECASES_PROXY)
    private readonly updateUsecase: UseCaseProxy<UpdateCategoryUseCases>,
    @Inject(UsecasesProxyModule.DELETE_CATEGORY_USECASES_PROXY)
    private readonly deleteUsecase: UseCaseProxy<DeleteCategoryUseCases>,
    @Inject(UsecasesProxyModule.GET_LIST_CATEGORY_USECASES_PROXY)
    private readonly getListUsecase: UseCaseProxy<GetListCategoryUseCases>,
    @Inject(UsecasesProxyModule.GET_ANALIST_CATEGORY_USECASES_PROXY)
    private readonly getAnalyst: UseCaseProxy<AnalystCategoryUseCases>,
  ) {}

  @MessagePattern(CATEGORY_MESSAGE_PATTERNS.create)
  async create(@Payload() createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;
    const category = await this.createUsecase
      .getInstance()
      .excute(name, description);
    return category;
  }

  @MessagePattern(CATEGORY_MESSAGE_PATTERNS.getList)
  async getList() {
    const result = await this.getListUsecase.getInstance().excute();
    return result;
  }

  @MessagePattern(CATEGORY_MESSAGE_PATTERNS.update)
  async update(@Payload() updateDto: UpdateCategoryDto) {
    const { id, name, description } = updateDto;
    const result = await this.updateUsecase
      .getInstance()
      .excute(id, name, description);
    return result;
  }

  @MessagePattern(CATEGORY_MESSAGE_PATTERNS.delete)
  async deleteCategory(@Payload('id', ParseIntPipe) id: number) {
    const result = await this.deleteUsecase.getInstance().excute(id);
    return result;
  }

  @MessagePattern(CATEGORY_MESSAGE_PATTERNS.analyst)
  async analyst() {
    const result = await this.getAnalyst.getInstance().excute();
    return result;
  }
}
