import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Column({ length: 255, nullable: false })
  senha: string;

  @Column({ length: 5000, nullable: true })
  foto: string;

  @IsNotEmpty()
  @Column({ type: 'enum', enum: ['ADMIN', 'CLIENTE'], default: 'CLIENTE' })
  tipo: string;

  @Column({ length: 14, nullable: true, unique: true })
  documento: string;

  @Column({ type: 'date', nullable: true })
  dataNasc: string;

  @Column({ length: 50, nullable: true })
  telefone: string;

  @OneToMany(() => Produto, (produto) => produto.usuario)
  produto: Produto[];
}
