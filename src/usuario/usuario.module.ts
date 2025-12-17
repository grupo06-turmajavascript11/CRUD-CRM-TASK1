import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { UsuarioService } from "./services/usuario.service";
import { UsuarioController } from "./controllers/usuario.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule],
})
export class UsuarioModule {}
