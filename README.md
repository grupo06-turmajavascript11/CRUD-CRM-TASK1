# CRM – Backend para Gerenciamento de Clientes

Backend desenvolvido em NestJS para gerenciamento de clientes (módulo CRM), com operações completas de CRUD e consulta específica por nome. O projeto foi construído como solução para o **Task 1 – Backend (CRUD Completo)**.

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

### `main.ts`  
  - Inicializa a aplicação NestJS;
  - Define timezone (`process.env.TZ = '-03:00'`);
  - Configura `ValidationPipe` global;
  - Habilita CORS;
  - Sobe o servidor na porta `4000`.

### `app.module.ts`  
  - Configura a conexão com o banco de dados via `TypeOrmModule.forRoot`;
  - Registra a entidade `Cliente`;
  - Importa o `ClienteModule`.

### `cliente/cliente.module.ts`  
  - Registra o controller e o service de clientes;
  - Importa o repositório da entidade `Cliente`.

### `cliente/controllers/cliente.controller.ts`  
  - Define as rotas HTTP (`/clientes`);
  - Mapeia os métodos de CRUD e busca específica.

### `cliente/services/cliente.service.ts`  
  - Implementa as regras de negócio;
  - Realiza o acesso ao banco via `Repository<Cliente>` do TypeORM.

### `cliente/entities/cliente.entity.ts`  
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

## Funcionalidades (CRUD + Consulta Específica)

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

4. Criar novo cliente

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

```css
async update(cliente: Cliente): Promise<Cliente> {
  await this.findById(cliente.id);
  return await this.clienteRepository.save(cliente);
}
```

6. Excluir cliente

Método HTTP: DELETE

Rota: /clientes/:id

Parâmetro de rota: id (number)

Descrição: Remove o cliente com o ID informado.

Regras:

Antes de excluir, o service chama findById(id); se não encontrar, é lançada exceção.

Implementação:

Controller: delete(@Param('id', ParseIntPipe) id: number)

Service:

```css
async delete(id: number): Promise<DeleteResult> {
  const buscaCliente = await this.findById(id);

  if (!buscaCliente)
    throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

  return await this.clienteRepository.delete(id);
}
```

---

## Tecnologias Utilizadas

- Backend:

Node.js

NestJS

TypeScript

TypeORM

class-validator

- Banco de Dados:

MySQL

Banco de dados: db_crm

Tabela principal: tb_clientes

---

## Configuração do Ambiente
Pré-requisitos:

- Node.js instalado

- NPM 

- MySQL em execução local

Banco de dados db_crm criado:
```css
CREATE DATABASE db_crm;
```

---

## Como Executar o Projeto

1. Clonar o repositório
```css
git clone <URL-DO-REPOSITORIO>
cd <nome-da-pasta>
```
2. Instalar as dependências
```css
npm install
```
3. Configurar o banco de dados

Garantir que o MySQL está rodando em localhost:3306;

Banco db_crm criado;

Ajustar username e password em app.module.ts, se necessário.

4. Iniciar a aplicação em modo desenvolvimento
```css
npm run start:dev
```
5. Acessar a API

URL base: http://localhost:4000

Exemplos de rotas:

GET http://localhost:4000/clientes

POST http://localhost:4000/clientes

GET http://localhost:4000/clientes/1

GET http://localhost:4000/clientes/nome/joao

---

## Testes dos Endpoints

Recomenda-se o uso de ferramentas como Insomnia ou Postman para validação das funcionalidades.

Sequência sugerida de testes:

1. Criar cliente

  - POST /clientes com body JSON válido.

2. Listar todos os clientes

   - GET /clientes

3. Buscar por ID

    - GET /clientes/:id

4. Buscar por nome (consulta específica)

    - GET /clientes/nome/:nome

5. Atualizar cliente

    - PUT /clientes com id existente.

6. Excluir cliente

    - DELETE /clientes/:id

7. Validar erro de não encontrado

    - GET /clientes/:id para um ID inexistente.

---

## Critérios do Desafio Atendidos

- Model criada com mais de 4 atributos além do ID (nome, rg, cpf, dataNasc, telefone, email, endereco);

- Todos os métodos básicos de CRUD implementados:

findAll()

findById()

create() (POST)

update() (PUT)

delete() (DELETE)

- Método de consulta específica por atributo:

findByNome() / GET /clientes/nome/:nome

- Backend executando sem erros, com criação automática da tabela tb_clientes via synchronize: true;

- Estrutura organizada em módulo, controller, service e entity;

- Validações de dados aplicadas via class-validator e ValidationPipe global.