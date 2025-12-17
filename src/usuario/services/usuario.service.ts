import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil, Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(perfilBuscado : Perfil): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
        where: {perfil: perfilBuscado }
    });

  }

  async findById(id: number): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    return usuario;
  }

  async findByNome(nome: string): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
    });
  }

async findByUsuario(usuario: string): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({ where: { usuario } });

    return user;
  }

  async findByCpf(cpf: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { cpf } });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByTelefone(telefone: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { telefone } });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(usuario: Usuario): Promise<Usuario> {
  const tipoUsuario = usuario.perfil;

  const usuarioExiste = await this.findByUsuario(usuario.usuario);
  if (usuarioExiste) {
    throw new HttpException(
      'Este e-mail já está cadastrado!',HttpStatus.BAD_REQUEST);
  }

  if (tipoUsuario === 'ADMIN') {
    if (
      usuario.cpf ||
      usuario.dataNasc ||
      usuario.telefone ||
      usuario.endereco ||
      usuario.foto
    ) {
      throw new HttpException('Campos inválidos para o tipo ADMIN!',HttpStatus.BAD_REQUEST);
    }

    return this.usuarioRepository.save(usuario);
  }

  if (usuario.cpf && usuario.dataNasc && usuario.telefone && usuario.endereco) {
    return this.usuarioRepository.save(usuario);
  }

  throw new HttpException('Usuário com campos inválidos!',HttpStatus.BAD_REQUEST);
}

  async update(usuario: Usuario): Promise<Usuario> {
    const tipoUsuario = usuario.perfil
    
    const usuarioExiste = await this.findById(usuario.id) 

    if (!usuarioExiste){
        throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)
    }
    if (tipoUsuario === 'ADMIN'){
        return this.usuarioRepository.save(usuario)
    }
    if (usuario.cpf && usuario.dataNasc && usuario.telefone && usuario.endereco){
        throw new HttpException('Campos inválidos para o perfil ADMIN', HttpStatus.BAD_REQUEST)
    }
     
    if (usuario.cpf && usuario.dataNasc && usuario.telefone && usuario.endereco){
        return this.usuarioRepository.save(usuario)
    }
    throw new HttpException('Usuário com campos inválidos!',HttpStatus.BAD_REQUEST)
        

  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);

    return await this.usuarioRepository.delete(id);
  }

    async autodelete(id: number): Promise<DeleteResult> {
    const buscarUsuario = await this.findById(id);
    if(!buscarUsuario){
        throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)
    }

    return await this.usuarioRepository.delete(id);
  }
}
