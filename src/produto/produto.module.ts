import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoController } from './controllers/produto.controller';
import { ProdutoService } from './services/produto.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { CategoriaModule } from '../categoria/categoria.module';


@Module({
  imports: [TypeOrmModule.forFeature([Produto]), UsuarioModule, CategoriaModule],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService],
})
export class ProdutoModule {}