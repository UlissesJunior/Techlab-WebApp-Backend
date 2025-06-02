

<h1  align="center">
💲<br>Tech4Humans Finance - WebApp para gestão financeira
</h1>

Bem-vindo ao repositório do backend do projeto *Tech4Humans Finance*, um webApp desenvolvido para gerenciar finanças pessoais. Este projeto é parte de um teste técnico para uma vaga como desenvolvedor na Tech4Humans.

---

## Sumário

1. [Introdução e Visão Geral](#introdução-e-visão-geral)

2. [Tecnologias e Dependências Utilizadas](#tecnologias-e-dependências-utilizadas)

3. [Estrutura do Projeto](#estrutura-do-projeto)

4. [Documentação das rotas](#documentação-das-rotas)

5. [Como Executar o Projeto](#como-executar-o-projeto)

---

## Introdução e Visão Geral

O backend do Tech4Humans Finance foi desenvolvido para fornecer todos os serviços necessários para o funcionamento do aplicativo web de gestão financeira. A API oferece:

-   Autenticação segura de usuários com JWT
    
-   CRUD completo para contas bancárias
    
-   Gerenciamento de transações financeiras (débito, crédito e transferências)
    
-   Consultas com filtros
    
-   Validação de dados robusta
    

**Principais características técnicas:**

-   Arquitetura limpa e modular
    
-   Validação de dados em todas as requisições
    
-   Tratamento centralizado de erros
    
-   Documentação completa das rotas
    
-   Testes unitários para os principais serviços
 
## Tecnologias e Dependências Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e bibliotecas:  

*  **Nest JS:** Um framework super completo que roda o express por baixo dos panos, é muito escalável e é crucial na comunidade backend web. O nest possui uma arquitetura limpa e orientada a objetos com base em módulos, assim como o angular, o que o torna bem manutenível.
  
*  **Jest:** Para a implementação de **testes unitários** nas rotas e na lógica de negócio, garantindo a robustez e o correto funcionamento da aplicação.

* **Sqlite3:** Um sistema de gerenciamento de banco de dados relacional leve e serverless. É ideal para projetos pequenos e médios, desenvolvimento local e testes, por não exigir um servidor de banco de dados separado.

* **TypeORM:** Um Object-Relational Mapper (ORM) que permite trabalhar com bancos de dados relacionais utilizando objetos TypeScript/JavaScript. O TypeORM facilita a interação com o banco de dados, mapeando as entidades da aplicação para tabelas, o que torna as operações de CRUD (Create, Read, Update, Delete) mais intuitivas e menos propensas a erros de SQL.

## **Estrutura do Projeto**

A estrutura do projeto tem a seguinte estrutura (a partir do src):
```
src/
├─ accounts/
│  ├─ __tests__/
│  │  ├─ account.controller.spec.ts
│  │  └─ account.service.spec.ts
│  ├─ dto/
│  │  ├─ create-account.dto.ts
│  │  └─ update-account.dto.ts
│  ├─ entities/
│  │  └─ account.entity.ts
│  ├─ utils/
│  │  └─ account-validation.utils.ts
│  ├─ account.controller.ts
│  ├─ account.module.ts
│  └─ account.service.ts
├─ auth/
│  ├─ __tests__/
│  │  ├─ auth.controller.spec.ts
│  │  └─ auth.service.spec.ts
│  ├─ auth.controller.ts
│  ├─ auth.interface.ts
│  ├─ auth.module.ts
│  ├─ auth.service.ts
│  ├─ current-user.decorator.ts
│  ├─ jwt-auth.guard.ts
│  └─ jwt.strategy.ts
├─ common/
│  ├─ interceptor/
│  │  └─ transform.interceptor.ts
│  └─ pipe/
│     └─ global-validation.pipe.ts
├─ transactions/
│  ├─ __tests__/
│  │  ├─ transaction.controller.spec.ts
│  │  └─ transaction.service.spec.ts
│  ├─ dto/
│  │  └─ create-transaction.dto.ts
│  ├─ entities/
│  │  └─ transaction.entity.ts
│  ├─ utils/
│  │  └─ transaction-validation.utils.ts
│  ├─ transaction.controller.ts
│  ├─ transaction.module.ts
│  └─ transaction.service.ts
├─ users/
│  ├─ __tests__/
│  │  ├─ user.controller.spec.ts
│  │  └─ user.service.spec.ts
│  ├─ dto/
│  │  ├─ create-user.dto.ts
│  │  ├─ login-user.dto.ts
│  │  └─ upload-photo.dto.ts
│  ├─ entities/
│  │  └─ user.entity.ts
│  ├─ user.controller.ts
│  ├─ user.module.ts
│  └─ user.service.ts
├─ app.module.ts
└─ main.ts

```

## Documentação das rotas

As rotas estão contidas na collection do postman para teste no arquivo [Techlab.postman_collection.json](https://github.com/UlissesJunior/Techlab-WebApp-Backend/blob/main/Techlab.postman_collection.json)


| Módulo       | Método | Endpoint               | Descrição                     |
|--------------|--------|------------------------|-------------------------------|
| Auth         | POST   | `/auth/login`          | Login de usuário              |
| Users        | POST   | `/users`               | Criar novo usuário            |
| Users        | POST   | `/users/:id/photo`     | Upload de foto                |
| Accounts     | POST   | `/accounts`            | Criar nova conta              |
| Accounts     | GET    | `/accounts`            | Listar contas do usuário      |
| Transactions     | POST  | `/transactions`        | Criar transação               |
| Transactions | GET    | `/transactions`        | Listar transações com filtros |

## **Como Executar o Projeto**

Para executar este projeto em seu ambiente de desenvolvimento local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* Node.js (versão LTS recomendada)

* npm

* Git

### 1. Clone o Repositório

Abra seu terminal ou prompt de comando e execute:

```bash

git clone github.com/UlissesJunior/Techlab-WebApp-Backend

cd Techlab-WebApp-Backend

```

### 2. Configuração e Execução

Execute o comando a seguir para instalar as dependências necessárias.

```bash

npm install

```

Para iniciar a aplicação React:

```bash

npm run start

```

A aplicação estará disponível em `http://localhost:8000`.

Para rodar os testes:

```bash

npm run test

```
Certifique-se de que o frontend esteja rodando junto ao backend.