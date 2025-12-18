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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../security/roles.decorators';
import { RolesGuard } from '../../security/roles.guards';

@ApiTags('Categoria')
@Controller('/categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @ApiOperation({ summary: 'Listar todas as categorias disponíveis' })
  @ApiOkResponse({
    description: 'Lista de categorias retornada com sucesso.',
    type: [Categoria],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
  @ApiOkResponse({ description: 'Categoria encontrada.', type: Categoria })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.categoriaService.findById(id);
  }

  @ApiOperation({ summary: 'Buscar categorias por palavra-chave' })
  @ApiParam({
    name: 'categoria',
    description: 'Nome ou parte do nome da categoria',
  })
  @ApiOkResponse({ description: 'Lista filtrada.', type: [Categoria] })
  @Get('/nome/:categoria')
  @HttpCode(HttpStatus.OK)
  findAllByNome(@Param('categoria') categoria: string): Promise<Categoria[]> {
    return this.categoriaService.findByNome(categoria);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova categoria (Apenas Admin)' })
  @ApiBody({ type: Categoria })
  @ApiCreatedResponse({
    description: 'Categoria criada com sucesso.',
    type: Categoria,
  })
  @ApiForbiddenResponse({ description: 'Acesso negado.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() Categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.create(Categoria);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar categoria existente (Apenas Admin)' })
  @ApiBody({ type: Categoria })
  @ApiOkResponse({ description: 'Categoria atualizada.', type: Categoria })
  @ApiForbiddenResponse({ description: 'Acesso negado.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() Categoria: Categoria): Promise<Categoria> {
    return this.categoriaService.update(Categoria);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover categoria (Apenas Admin)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({ description: 'Categoria deletada com sucesso.' })
  @ApiForbiddenResponse({ description: 'Acesso negado.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.delete(id);
  }
}
