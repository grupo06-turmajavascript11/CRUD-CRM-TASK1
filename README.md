# CRM – Backend para Gerenciamento de Clientes

Backend desenvolvido em NestJS para gerenciamento de clientes (módulo CRM), com operações completas de CRUD e consulta específica por nome. O projeto foi construído como solução para o **Desafio 1 – Backend (CRUD Completo)**.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Modelo de Negócio](#modelo-de-negócio)
- [Arquitetura da Aplicação](#arquitetura-da-aplicação)
- [Entidade Cliente](#entidade-cliente)
- [Funcionalidades (CRUD + Consulta Específica)](#funcionalidades-crud--consulta-específica)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Testes dos Endpoints](#testes-dos-endpoints)
- [Critérios do Desafio Atendidos](#critérios-do-desafio-atendidos)

---

## Visão Geral

Este projeto implementa uma API backend responsável pelo gerenciamento de clientes, permitindo:

- Cadastro de novos clientes;
- Consulta de todos os clientes ou de um cliente específico;
- Atualização de dados;
- Exclusão de registros;
- Busca específica por parte do nome.

A aplicação segue o padrão REST e utiliza **NestJS** com **TypeScript**, conectando-se a um banco de dados **MySQL** via **TypeORM**.

---

## Modelo de Negócio

- **Título do Projeto:** CRM – Sistema de Gerenciamento de Clientes  
- **Modelo de Negócio Escolhido:** CRM (Customer Relationship Management)  
  O foco é centralizar e organizar os dados de clientes, permitindo futuras integrações com sistemas de vendas, atendimento e relacionamento.

---

## Arquitetura da Aplicação

A aplicação segue a estrutura padrão de um projeto NestJS, com separação em módulos, controllers, services e entities.

Principais arquivos:

- `main.ts`  
  - Inicializa a aplicação NestJS;
  - Define timezone (`process.env.TZ = '-03:00'`);
  - Configura `ValidationPipe` global;
  - Habilita CORS;
  - Sobe o servidor na porta `4000`.

- `app.module.ts`  
  - Configura a conexão com o banco de dados via `TypeOrmModule.forRoot`;
  - Registra a entidade `Cliente`;
  - Importa o `ClienteModule`.

- `cliente/cliente.module.ts`  
  - Registra o controller e o service de clientes;
  - Importa o repositório da entidade `Cliente`.

- `cliente/controllers/cliente.controller.ts`  
  - Define as rotas HTTP (`/clientes`);
  - Mapeia os métodos de CRUD e busca específica.

- `cliente/services/cliente.service.ts`  
  - Implementa as regras de negócio;
  - Realiza o acesso ao banco via `Repository<Cliente>` do TypeORM.

- `cliente/entities/cliente.entity.ts`  
  - Define a entidade `Cliente` e seu mapeamento para a tabela `tb_clientes`.

---

## Entidade Cliente

A entidade `Cliente` representa a tabela `tb_clientes` no banco de dados `db_crm`.

```css
@Entity({ name: 'tb_clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column({ length: 11, nullable: false, unique: true })
  rg: string;

  @IsNotEmpty()
  @Column({ length: 11, nullable: false, unique: true })
  cpf: string;

  @IsISO8601()
  @Column({ type: 'date', nullable: false })
  dataNasc: string;

  @IsNotEmpty()
  @Column({ length: 50, nullable: false, unique: true })
  telefone: string;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  endereco: string;
}

```
Atributos
| Campo      | Tipo   | Descrição                                 |
| ---------- | ------ | ----------------------------------------- |
| `id`       | number | Identificador único (chave primária)      |
| `nome`     | string | Nome completo do cliente                  |
| `rg`       | string | RG do cliente (valor único)               |
| `cpf`      | string | CPF do cliente (valor único)              |
| `dataNasc` | date   | Data de nascimento (formato `yyyy-mm-dd`) |
| `telefone` | string | Telefone de contato (valor único)         |
| `email`    | string | E-mail do cliente (valor único)           |
| `endereco` | string | Endereço completo                         |


Validações via class-validator:

@IsNotEmpty() para campos obrigatórios;

@IsISO8601() para a data de nascimento.

Funcionalidades (CRUD + Consulta Específica)

Todas as funcionalidades são expostas via ClienteController, com base no ClienteService.

1. Listar todos os clientes

Método HTTP: GET

Rota: /clientes

Descrição: Retorna todos os registros de clientes cadastrados.

Implementação:

Controller: findAll()

Service: findAll(): Promise<Cliente[]>

2. Buscar cliente por ID

Método HTTP: GET

Rota: /clientes/:id

Parâmetro de rota: id (number) – validado com ParseIntPipe

Descrição: Retorna o cliente correspondente ao ID informado.

Tratamento de erro:

Caso o cliente não exista, lança HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND).

Implementação:

Controller: findById()

Service: findById(id: number): Promise<Cliente>

3. Buscar clientes por nome (consulta específica)

Método HTTP: GET

Rota: /clientes/nome/:nome

Parâmetro de rota: nome (string)

Descrição: Retorna todos os clientes cujo nome contenha o texto informado, sem diferenciar maiúsculas/minúsculas.

Implementação:

Controller: findByTitulo() chamando clienteService.findByNome(nome)

Service:

```css
async findByNome(nome: string): Promise<Cliente[]> {
  return await this.clienteRepository.find({
    where: {
      nome: ILike(`%${nome}%`),
    },
  });
}
```
Observação: Esta funcionalidade atende ao requisito de “método de consulta específico por atributo”.

Criar novo cliente

Método HTTP: POST

Rota: /clientes

Body: objeto Cliente com os campos obrigatórios.

Descrição: Cria um novo registro no banco de dados.

Implementação:

Controller: create(@Body() cliente: Cliente)

Service: create(cliente: Cliente): Promise<Cliente>

5. Atualizar cliente existente

Método HTTP: PUT

Rota: /clientes

Body: objeto Cliente com id e demais campos a serem atualizados.

Descrição: Atualiza os dados de um cliente já cadastrado.

Regras:

Antes de atualizar, é feita a validação com findById(cliente.id) para garantir que o cliente existe.

Implementação:

Controller: update(@Body() cliente: Cliente)

Service:
