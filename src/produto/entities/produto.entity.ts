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

@Entity({ name: 'tb_produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  descricao: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  preco: number;
  @Column({ type: 'int', nullable: true })
  carencia: number;

  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: ['DISPONIVEL', 'EM_NEGOCIACAO', 'FECHADO'],
    default: 'DISPONIVEL',
  })
  status: string;

  @UpdateDateColumn()
  dataAtualizacao: Date;

  @IsNotEmpty()
  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  categoria: Categoria;

  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
