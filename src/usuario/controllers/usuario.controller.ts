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
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../security/roles.decorators';
import { RolesGuard } from '../../security/roles.guards';
import { AuthService } from '../../auth/services/auth.service';
import { LocalAuthGuard } from '../../auth/guard/local-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Usuario')
@Controller('/usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários (Apenas Admin)' })
  @ApiOkResponse({
    description: 'Lista de usuários retornada com sucesso.',
    type: [Usuario],
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou não fornecido.' })
  @ApiForbiddenResponse({
    description: 'Acesso negado (Requer permissão ADMIN).',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({ status: 200, description: 'Retorna o Token de Acesso' })
  @ApiResponse({ status: 401, description: 'Usuário ou senha inválidos' })
  @ApiBody({
    description: 'Entre com seu e-mail e senha',
    schema: {
      type: 'object',
      properties: {
        usuario: {
          type: 'string',
          example: 'admin@crm.com',
          description: 'E-mail cadastrado',
        },
        senha: {
          type: 'string',
          example: '12345678',
          description: 'Senha de acesso',
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID (Apenas Admin)' })
  @ApiParam({ name: 'id', description: 'ID numérico do usuário', example: 1 })
  @ApiOkResponse({ description: 'Usuário encontrado.', type: Usuario })
  @ApiForbiddenResponse({ description: 'Acesso negado.' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuários por parte do nome (Apenas Admin)' })
  @ApiParam({
    name: 'nome',
    description: 'Nome ou parte do nome',
    example: 'Admin',
  })
  @ApiOkResponse({
    description: 'Lista de usuários encontrados.',
    type: [Usuario],
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByNome(@Param('nome') nome: string): Promise<Usuario[]> {
    return this.usuarioService.findByNome(nome);
  }

  @ApiOperation({ summary: 'Cadastrar novo usuário (Sign Up)' })
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso.',
    type: Usuario,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou e-mail já existente.',
  })
  @Post('/cadastrar')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso.',
    type: Usuario,
  })
  @ApiBody({ type: Usuario })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'CLIENTE')
  @Put('/atualizar')
  @HttpCode(HttpStatus.OK)
  update(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.update(usuario);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário (Admin ou a própria conta)' })
  @ApiParam({ name: 'id', description: 'ID do usuário a ser deletado' })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso (Sem conteúdo).',
  })
  @ApiForbiddenResponse({
    description: 'Você não pode deletar outro usuário se não for Admin.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<DeleteResult> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.id !== id && req.user.tipo !== 'ADMIN') {
      throw new ForbiddenException(
        'Não autorizado: Você só pode deletar sua própria conta.',
      );
    }
    return this.usuarioService.delete(id);
  }
}
