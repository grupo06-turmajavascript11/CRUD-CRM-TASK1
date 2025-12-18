import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Maria da Silva',
  })
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ length: 100, nullable: false, unique: true })
  @ApiProperty({
    description: 'Email de acesso (Login)',
    example: 'maria.silva@email.com',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Column({ length: 255, nullable: false })
  @ApiProperty({
    description: 'Senha de acesso (Mínimo 8 caracteres)',
    example: 'senhaForte@123',
    minLength: 8,
  })
  senha: string;

  @Column({ length: 5000, nullable: true })
  @ApiProperty({
    description: 'URL da foto de perfil',
    example: 'https://i.imgur.com/foto-maria.jpg',
    nullable: true,
    required: false,
  })
  foto: string;

  @IsNotEmpty()
  @Column({ type: 'enum', enum: ['ADMIN', 'CLIENTE'], default: 'CLIENTE' })
  @ApiProperty({
    description: 'Nível de permissão do usuário',
    example: 'CLIENTE',
    enum: ['ADMIN', 'CLIENTE'],
    default: 'CLIENTE',
  })
  tipo: string;

  @Column({ length: 18, nullable: true, unique: true })
  @ApiProperty({
    description: 'Documento (CPF ou CNPJ)',
    example: '123.456.789-00',
    nullable: true,
    required: false,
  })
  documento: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({
    description: 'Data de nascimento',
    example: '1990-05-20',
    nullable: true,
    required: false,
    type: 'string',
    format: 'date',
  })
  dataNasc: string;

  @Column({ length: 50, nullable: true, unique: true })
  @ApiProperty({
    description: 'Telefone de contato',
    example: '(11) 99999-8888',
    nullable: true,
    required: false,
  })
  telefone: string;

  @OneToMany(() => Produto, (produto) => produto.usuario)
  @ApiProperty({
    type: () => Produto,
    isArray: true,
    description: 'Lista de produtos/seguros adquiridos por este usuário',
    required: false,
  })
  produto: Produto[];
}
