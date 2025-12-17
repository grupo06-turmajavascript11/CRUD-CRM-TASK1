import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      // relations: ['produto'] // Descomente quando tiver o relacionamento
    });
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      // relations: ['produto']
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email: usuario },
    });
  }

  async findByNome(nome: string): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
    });
  }

  async create(usuario: Usuario): Promise<Usuario> {
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    return await this.usuarioRepository.save(usuario);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const buscaUsuario = await this.findById(usuario.id);

    if (usuario.senha && usuario.senha !== buscaUsuario.senha) {
      usuario.senha = await bcrypt.hash(usuario.senha, 10);
    }

    return await this.usuarioRepository.save(usuario);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaUsuario = await this.findById(id);
    if (!buscaUsuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    return await this.usuarioRepository.delete(id);
  }
}
