import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaService } from '../../categoria/services/categoria.service';
import { UsuarioService } from '../../usuario/services/usuario.service';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: ['categoria', 'usuario'],
    });
  }

  async findCatalogo(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: { status: 'DISPONIVEL' },
      relations: ['categoria'],
    });
  }

  async findByCliente(usuarioId: number): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: ['categoria'],
    });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['categoria', 'usuario'],
    });

    if (!produto) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return produto;
  }

  async findByIdPublico(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id, status: 'DISPONIVEL' },
      relations: ['categoria'],
    });

    if (!produto) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return produto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
        status: 'DISPONIVEL',
      },
      relations: ['categoria'],
    });
  }

  async create(produto: Produto): Promise<Produto> {
    if (produto.categoria) {
      const categoria = await this.categoriaService.findById(
        produto.categoria.id,
      );
      if (!categoria)
        throw new HttpException(
          'Categoria não encontrada',
          HttpStatus.NOT_FOUND,
        );
    }

    return await this.produtoRepository.save(produto);
  }

  async criarOportunidade(
    produtoOriginalId: number,
    usuarioId: number,
  ): Promise<Produto> {
    const produtoOriginal = await this.findById(produtoOriginalId);

    const cliente = await this.usuarioService.findById(usuarioId);

    const novaOportunidade = this.produtoRepository.create({
      ...produtoOriginal,
      id: undefined,
      status: 'EM_NEGOCIACAO',
      usuario: cliente,
      dataAtualizacao: undefined,
    });

    return await this.produtoRepository.save(novaOportunidade);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);

    if (produto.categoria) {
      const categoria = await this.categoriaService.findById(
        produto.categoria.id,
      );
      if (!categoria)
        throw new HttpException(
          'Categoria não encontrada',
          HttpStatus.NOT_FOUND,
        );
    }

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.produtoRepository.delete(id);
  }
}
