import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './produto/entities/produto.entity';
import { Categoria } from './categoria/entities/categoria.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { ProdutoModule } from './produto/produto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_crm',
      entities: [Produto, Categoria, Usuario],
      synchronize: true,
    }),
    ProdutoModule,
    CategoriaModule,
    UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
