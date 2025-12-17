import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from './produto.entity';

@Entity({ name: 'tb_categorias' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string; // Ex: "Seguro de Vida", "Seguro Auto"

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  descricao: string; 

  // Relacionamento: Uma categoria tem vários produtos/oportunidades
  @OneToMany(() => Produto, (produto) => produto.categoria)
  produto: Produto[];
}