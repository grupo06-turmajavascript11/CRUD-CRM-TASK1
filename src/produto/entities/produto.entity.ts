import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  @ApiProperty({
    example: 'Seguro de Vida Familiar',
    description: 'Nome comercial do produto ou serviço',
  })
  nome: string;

  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  @ApiProperty({
    example: 'Cobertura completa para titular e dependentes...',
    description: 'Descrição detalhada dos benefícios',
  })
  descricao: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({
    example: 199.9,
    description: 'Preço unitário em Reais (R$)',
    type: 'number',
  })
  preco: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({
    example: 30,
    description: 'Período de carência em dias/meses (se houver)',
    required: false,
    nullable: true,
  })
  carencia: number;

  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: ['DISPONIVEL', 'EM_NEGOCIACAO', 'FECHADO'],
    default: 'DISPONIVEL',
  })
  @ApiProperty({
    example: 'DISPONIVEL',
    description: 'Status atual do produto no catálogo',
    enum: ['DISPONIVEL', 'EM_NEGOCIACAO', 'FECHADO'],
    default: 'DISPONIVEL',
  })
  status: string;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última alteração no registro' })
  dataAtualizacao: Date;

  @IsNotEmpty()
  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    type: () => Categoria,
    description: 'Categoria a qual este produto pertence',
  })
  categoria: Categoria;

  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    type: () => Usuario,
    description:
      'Cliente que adquiriu este produto (Opcional se for item de catálogo)',
    required: false,
  })
  usuario: Usuario;
}
