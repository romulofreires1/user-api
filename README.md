
# User API

User API é uma aplicação construída com NestJS, TypeORM e PostgreSQL para gerenciar usuários. A API oferece funcionalidades básicas de CRUD (Create, Read, Update, Delete) para usuários e está configurada para rodar tanto localmente quanto dentro de contêineres Docker.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações Node.js escaláveis.
- **TypeORM**: ORM (Object-Relational Mapper) para interagir com o banco de dados PostgreSQL.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional utilizado.
- **Docker**: Plataforma de contêineres utilizada para empacotar a aplicação e suas dependências.

## Configuração para Desenvolvimento Local

### Pré-requisitos

- Node.js v18+
- npm (ou yarn)
- PostgreSQL
- Docker (opcional para rodar via contêineres)

### Passos para Executar Localmente

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/romulofreires1/user-api.git
   cd user-api
   ```

2. **Instale as Dependências**

   ```bash
   yarn
   ```

3. **Configure o Banco de Dados**

   Crie um banco de dados PostgreSQL chamado `userdb` e configure suas credenciais de acesso no arquivo `.env`:

   **.env**

   ```plaintext
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=userdb
   ```

4. **Execute as Migrações**

   Para garantir que a estrutura do banco de dados esteja atualizada:

   ```bash
   npm run build
   npx typeorm migration:run -d ./dist/data-source.js
   ```

5. **Inicie a Aplicação**

   Inicie a aplicação em modo de desenvolvimento:

   ```bash
   yarn start:dev
   ```

## Executando a API
swagger: http://localhost:3000/api
### Pré-requisitos

- Docker e Docker Compose instalados.

### Comandos Úteis

- **Subir Contêineres com Docker Compose**

  ```bash
  docker-compose up --build
  ```

- **Derrubar Contêineres e Remover Volumes**

  ```bash
  docker-compose down --volumes --remove-orphans
  ```

- **Iniciar Aplicação Localmente com NestJS**

  ```bash
  npm run start:dev
  ```

- **Executar Testes**

  ```bash
  npm run test
  ```

## Licença

Este projeto está licenciado sob a licença MIT.