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
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../entities/produto.entity';
import { DeleteResult } from 'typeorm';
import { RolesGuard } from '../../security/roles.guards';
import { Roles } from '../../security/roles.decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/catalogo')
  @HttpCode(HttpStatus.OK)
  findCatalogo(): Promise<Produto[]> {
    return this.produtoService.findCatalogo();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/meus-seguros/:usuarioId')
  @HttpCode(HttpStatus.OK)
  findMinhasCompras(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<Produto[]> {
    return this.produtoService.findByCliente(usuarioId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/publico/:id')
  @HttpCode(HttpStatus.OK)
  findByIdPublico(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findByIdPublico(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findByNome(nome);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/adquirir')
  @HttpCode(HttpStatus.CREATED)
  adquirir(
    @Body() dados: { produtoId: number; usuarioId: number },
  ): Promise<Produto> {
    return this.produtoService.criarOportunidade(
      dados.produtoId,
      dados.usuarioId,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.produtoService.delete(id);
  }
}
