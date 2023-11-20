import { Controller, Inject, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  UseCaseProxy,
  UsecasesProxyModule,
} from 'src/infrastructure/usecases-proxy/usecases-proxy.module';

import { CreateUnitUseCase } from 'src/usecases/unit/createUnit';
import { UpdateUnitUseCase } from 'src/usecases/unit/updateUnit';
import { DeleteUnitUseCase } from 'src/usecases/unit/deleteUnit';
import { UNIT_MESSAGE_PATTERNS } from './messagePattern';

@Controller('unit')
export class UnitController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_UNIT_USECASES_PROXY)
    private readonly createUsecase: UseCaseProxy<CreateUnitUseCase>,
    @Inject(UsecasesProxyModule.UPDATE_UNIT_USECASES_PROXY)
    private readonly updateUsecase: UseCaseProxy<UpdateUnitUseCase>,
    @Inject(UsecasesProxyModule.DELETE_UNIT_USECASES_PROXY)
    private readonly deleteUsecase: UseCaseProxy<DeleteUnitUseCase>,
  ) {}

  @MessagePattern(UNIT_MESSAGE_PATTERNS.create)
  async create(
    @Payload()
    createDto: {
      title: string;
      course_id: number;
      drive_folder_unit_id: string;
    },
  ) {
    const { title, course_id, drive_folder_unit_id } = createDto;
    const result = await this.createUsecase
      .getInstance()
      .excute(title, course_id, drive_folder_unit_id);
    return result;
  }

  @MessagePattern(UNIT_MESSAGE_PATTERNS.update)
  async update(
    @Payload() updateDto: { unit_id: number; title: string; status: string },
  ) {
    const { unit_id, title, status } = updateDto;
    const result = await this.updateUsecase
      .getInstance()
      .excute(unit_id, title, status);
    return result;
  }

  @MessagePattern(UNIT_MESSAGE_PATTERNS.delete)
  async delete(@Payload('id', ParseIntPipe) id: number) {
    const result = await this.deleteUsecase.getInstance().excute(id);
    return result;
  }
}
