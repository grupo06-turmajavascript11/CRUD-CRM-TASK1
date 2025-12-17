import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Oportunidade } from "../entities/oportunidade.entity";
import { OportunidadeService } from "../services/oportunidade.service";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Oportunidade')
@Controller("/Oportunidade")
export class OportunidadeController {
    [x: string]: any;
    constructor(private readonly OportunidadeService: OportunidadeService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Oportunidade[]> {
        return this.oportunidadeService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Oportunidade> {
        return this.oportunidadeService.findById(id);
    }

    @Get('/descricao/:descricao')
    @HttpCode(HttpStatus.OK)
    findAllBydescricao(@Param('descricao') descricao: string): Promise<Oportunidade[]> {
        return this.oportunidadeService.findByDescricao(descricao);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() Oportunidade: Oportunidade): Promise<Oportunidade> {
        return this.oportunidadeService.create(Oportunidade);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() Oportunidade: Oportunidade): Promise<Oportunidade> {
        return this.oportunidadeService.update(Oportunidade);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.oportunidadeService.delete(id);
    }

}
