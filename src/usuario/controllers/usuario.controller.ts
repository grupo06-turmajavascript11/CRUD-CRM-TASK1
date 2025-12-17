import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { UsuarioService } from '../services/usuario.service';
import { Perfil, Usuario } from '../entities/usuario.entity';

@Controller('/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('/perfil/:perfil')
  @HttpCode(HttpStatus.OK)
  findByPerfil(@Param('perfil')perfil: Perfil): Promise<Usuario[]> {
    return this.usuarioService.findAll(perfil);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario | null> {
    return this.usuarioService.findById(id);
  }

  @Get('/nome/:nome')
  @HttpCode(HttpStatus.OK)
  findByTitulo(@Param('nome') nome: string): Promise<Usuario[]> {
    return this.usuarioService.findByNome(nome);
  }

  @Get('/usuario/:usuario')
  @HttpCode(HttpStatus.OK)
  findByUsuario(@Param('usuario') usuario: string): Promise<Usuario | null> {
    return this.usuarioService.findByUsuario(usuario);
  }

  @Get('/cpf/:cpf')
  @HttpCode(HttpStatus.OK)
  findByCpf(@Param('cpf') cpf: string): Promise<Usuario> {
    return this.usuarioService.findByCpf(cpf);
  }

  @Get('/telefone/:telefone')
  @HttpCode(HttpStatus.OK)
  findByTelefone(@Param('telefone') telefone: string): Promise<Usuario> {
    return this.usuarioService.findByTelefone(telefone);
  }

  @Post('/cadastrar')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }

  @Put('/:atualizar')
  @HttpCode(HttpStatus.OK)
  update(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.update(usuario);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usuarioService.delete(id);
  }
  
  @Delete('/cliente/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  autodelete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.usuarioService.autodelete(id);
  }
}
