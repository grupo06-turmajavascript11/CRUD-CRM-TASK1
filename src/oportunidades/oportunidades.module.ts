import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oportunidade } from './entities/oportunidade.entity';
import { OportunidadeController } from './controllers/oportunidade.controller';
import { OportunidadeService } from './services/oportunidade.service';

@Module({
  imports: [TypeOrmModule.forFeature([Oportunidade])],
  controllers: [OportunidadeController],
  providers: [OportunidadeService],
  exports: [OportunidadeService],
})
export class OportunidadeModule {}