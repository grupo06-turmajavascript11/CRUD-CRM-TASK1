import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find();
  }

  async findById(id: number): Promise<Cliente> {
    // Verifica primeiro se a postagem existe
    const cliente = await this.clienteRepository.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
    }
    return cliente;
  }

  async findByNome(nome: string): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
    });
  }

  async create(cliente: Cliente): Promise<Cliente> {
    return await this.clienteRepository.save(cliente);
  }

  async update(cliente: Cliente): Promise<Cliente> {
    await this.findById(cliente.id);

    return await this.clienteRepository.save(cliente);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaCliente = await this.findById(id);

    if (!buscaCliente)
      throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

    return await this.clienteRepository.delete(id);
  }
}
