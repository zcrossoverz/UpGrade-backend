import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { UnitService } from './unit.service';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  create(
    @Body()
    createDto: {
      title: string;
      course_id: number;
      drive_folder_id: string;
    },
  ) {
    return this.unitService.create(createDto);
  }

  @Post('/update')
  update(@Body() updateDto: { title: string; unit_id: number }) {
    return this.unitService.update(updateDto.title, updateDto.unit_id);
  }

  @Post('/delete/:id')
  delete(@Param('id') id: number) {
    return this.unitService.delete(id);
  }
}
