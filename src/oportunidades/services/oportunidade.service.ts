import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Oportunidade } from '../entities/oportunidade.entity';

@Injectable()
export class OportunidadeService {
  constructor(
    @InjectRepository(Oportunidade)
    private oportunidadRepository: Repository<Oportunidade>,
  ) {}

  async findAll(): Promise<Oportunidade[]> {
    return await this.oportunidadRepository.find();
  }
  async findById(id: number): Promise<Oportunidade> {
    const oportunidade = await this.oportunidadRepository.findOne({
      where: { id },
    });

    if (!oportunidade)
      throw new HttpException('Oportunidade não encontrado!', HttpStatus.NOT_FOUND);

    return oportunidade;
  }

  async findByDescricao(nome: string): Promise<Oportunidade[]> {
    return await this.oportunidadRepository.find({
      where: { nome: ILike(`%${nome}%`) },
    });
  }

  async create(oportunidade: Oportunidade): Promise<Oportunidade> {
    return await this.oportunidadRepository.save(oportunidade);
  }

  async update(oportunidade: Oportunidade): Promise<Oportunidade> {
    const buscaOportunidade = await this.findById(oportunidade.id);

    if (!buscaOportunidade)
      throw new HttpException('Oportunidade não encontrado!', HttpStatus.NOT_FOUND);

    return await this.oportunidadRepository.save(oportunidade);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaOportunidade = await this.findById(id);

    if (!buscaOportunidade)
      throw new HttpException('Oportunidade não encontrado!', HttpStatus.NOT_FOUND);

    return await this.oportunidadRepository.delete(id);
  }
}
