import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_categorias' })
export class Categoria {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  @ApiProperty({
    example: 'Seguros de Vida',
    description: 'Nome da categoria de produtos',
  })
  nome: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  @ApiProperty({
    type: () => Produto,
    isArray: true,
    required: false,
    description: 'Lista de produtos vinculados a esta categoria',
  })
  produto: Produto[];
}
