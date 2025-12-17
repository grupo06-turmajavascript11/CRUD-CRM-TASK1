import { IsEmail, IsIn, IsNotEmpty, MinLength } from "class-validator";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Perfil {
  ADMIN = "ADMIN",
  CLIENTE = "CLIENTE",
}

@Entity({ name: 'tb_usuarios' })
export class Usuario {


  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @Column({ length: 11, nullable: true, unique: true })
  cpf: string;

  @Column({ type: 'date', nullable: true })
  dataNasc: Date;

  @Column({ length: 50, nullable: true, unique: true })
  telefone: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  usuario: string;

  @Column({ length: 100, nullable: true })
  endereco: string;

  @MinLength(8)
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  senha: string;

  @Column({ length: 5000,nullable: true })
  foto: string;

  @IsIn([Perfil.ADMIN, Perfil.CLIENTE])
  @Column({
    type: "enum",
    enum: Perfil,
    default: Perfil.CLIENTE,
    nullable: false,
  })
  perfil: Perfil;

  // @IsNotEmpty()
  // @ManyToMany(() => Oportunidade, (oportunidade) => oportunidade.usuario, 
  // )
  // oportunidade: Oportunidade[];

}
