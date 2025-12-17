import { IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  // --- DADOS DO PRODUTO (O que é vendido) ---
  
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string; // Ex: "Seguro Auto Premium"

  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  descricao: string; // Detalhes da cobertura

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  preco: number; // Valor de tabela

  @Column({ type: 'date', nullable: true })
  carencia: string; // Data fim da carência ou data de validade

  // --- DADOS DA OPORTUNIDADE (O status da negociação) ---

  // Aqui está o segredo: O Status define se é apenas um item no catálogo ou uma venda em andamento
  // Sugestão de Enum: 
  // 'DISPONIVEL' (Produto criado pelo Admin, ninguém comprou ainda)
  // 'EM_NEGOCIACAO' (Cliente demonstrou interesse)
  // 'FECHADO' (Venda concluída)
  @IsNotEmpty()
  @Column({ 
      type: 'enum', 
      enum: ['DISPONIVEL', 'EM_NEGOCIACAO', 'FECHADO'], 
      default: 'DISPONIVEL' 
  })
  status: string;
  
  // Data que o cliente demonstrou interesse
  @UpdateDateColumn()
  dataAtualizacao: Date; 

  // --- RELACIONAMENTOS ---

  // Muitas Oportunidades pertencem a Uma Categoria
  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE'
  })
  categoria: Categoria;

  // Muitas Oportunidades pertencem a Um Usuário (Cliente)
  // OBS: Se o status for 'DISPONIVEL', este campo pode ficar NULL (ou vinculado ao Admin)
  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: 'CASCADE'
  })
  usuario: Usuario;
}