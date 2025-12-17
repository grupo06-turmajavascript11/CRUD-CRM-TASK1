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

@Controller('/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByNome(@Param('nome') nome: string): Promise<Usuario[]> {
    return this.usuarioService.findByNome(nome);
  }

  @Post('/cadastrar')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  @Put('/atualizar')
  @HttpCode(HttpStatus.OK)
  update(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.update(usuario);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<DeleteResult> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.user.id !== id && req.user.tipo !== 'ADMIN') {
      throw new ForbiddenException('Não autorizado');
    }
    return this.usuarioService.delete(id);
  }
}
