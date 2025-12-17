import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Categoria } from '../entities/categoria.entity';
import { CategoriaService } from '../services/categoria.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../security/roles.decorators';
import { RolesGuard } from '../../security/roles.guards';

@ApiTags('Categoria')
@Controller('/categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categoriaService.findById(id);
  }

  @Get('/categorias/:categoria')
  @HttpCode(HttpStatus.OK)
  findAllByNome(@Param('categoria') categoria: string): Promise<Categoria[]> {
    return this.categoriaService.findByNome(categoria);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() Categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.create(Categoria);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() Categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.update(Categoria);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.delete(id);
  }
}
