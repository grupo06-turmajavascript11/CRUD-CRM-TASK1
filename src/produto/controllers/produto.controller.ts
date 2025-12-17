import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../entities/produto.entity';
import { DeleteResult } from 'typeorm';

@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

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
  
  @Get('/meus-seguros/:usuarioId')
  @HttpCode(HttpStatus.OK)
  findMinhasCompras(@Param('usuarioId', ParseIntPipe) usuarioId: number): Promise<Produto[]> {
      return this.produtoService.findByCliente(usuarioId);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findByNome(nome);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Post('/adquirir')
  @HttpCode(HttpStatus.CREATED)
  adquirir(@Body() dados: { produtoId: number, usuarioId: number }): Promise<Produto> {
      return this.produtoService.criarOportunidade(dados.produtoId, dados.usuarioId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.produtoService.delete(id);
  }
}