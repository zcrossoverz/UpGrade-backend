import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  create(@Body() createDto: { name: string; description: string }) {
    return this.categoryService.create(createDto);
  }

  @Post('/')
  upload() {
    return this.categoryService.getList();
  }

  @Post('/update')
  update(@Body() updateDto: { id: number; name: string; description: string }) {
    return this.categoryService.update(
      updateDto.id,
      updateDto.name,
      updateDto.description,
    );
  }

  @Post('/delete/:id')
  delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
