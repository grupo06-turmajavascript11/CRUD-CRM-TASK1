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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Produto')
@Controller('/produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos (Visão Admin)' })
  @ApiOkResponse({ description: 'Lista completa retornada.', type: [Produto] })
  @ApiForbiddenResponse({
    description: 'Acesso negado (Requer permissão ADMIN).',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @ApiOperation({
    summary: 'Listar produtos disponíveis no catálogo (Público)',
  })
  @ApiOkResponse({ description: 'Lista de produtos ativos.', type: [Produto] })
  @Get('/catalogo')
  @HttpCode(HttpStatus.OK)
  findCatalogo(): Promise<Produto[]> {
    return this.produtoService.findCatalogo();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar produtos adquiridos por um cliente' })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID do usuário cliente',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lista de produtos do usuário.',
    type: [Produto],
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/meus-seguros/:usuarioId')
  @HttpCode(HttpStatus.OK)
  findMinhasCompras(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ): Promise<Produto[]> {
    return this.produtoService.findByCliente(usuarioId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalhes do produto (Visão Admin)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: Produto })
  @ApiForbiddenResponse({ description: 'Acesso negado.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @ApiOperation({ summary: 'Detalhes do produto (Visão Pública)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: Produto })
  @Get('/publico/:id')
  @HttpCode(HttpStatus.OK)
  findByIdPublico(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findByIdPublico(id);
  }

  @ApiOperation({ summary: 'Buscar produtos por nome' })
  @ApiParam({ name: 'nome', example: 'Seguro' })
  @ApiOkResponse({ type: [Produto] })
  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByNome(@Param('nome') nome: string): Promise<Produto[]> {
    return this.produtoService.findByNome(nome);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastrar novo produto' })
  @ApiBody({ type: Produto })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso.',
    type: Produto,
  })
  @ApiForbiddenResponse({ description: 'Apenas Admin pode criar produtos.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cliente adquire (compra) um produto' })
  @ApiBody({
    description: 'IDs do Produto e do Usuário',
    schema: {
      type: 'object',
      properties: {
        produtoId: { type: 'number', example: 1 },
        usuarioId: { type: 'number', example: 2 },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Oportunidade/Venda gerada com sucesso.' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do produto' })
  @ApiOkResponse({ type: Produto })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto do catálogo' })
  @ApiNoContentResponse({ description: 'Produto deletado com sucesso.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.produtoService.delete(id);
  }
}
