import { IsISO8601, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 11, nullable: false, unique: true })
  rg: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 11, nullable: false, unique: true })
  cpf: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsISO8601() //Decorator para datas yyyy-mm-dd
  @Column({ type: 'date', nullable: false })
  dataNasc: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 50, nullable: false, unique: true })
  telefone: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  endereco: string;
}
