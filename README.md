# FoodShare

Projeto da faculdade para conectar pessoas ou estabelecimentos que têm alimentos disponíveis com pessoas que querem resgatar esses alimentos.

O projeto foi feito de forma simples:

- HTML, CSS e JavaScript nas telas;
- Node.js com Express no servidor;
- PostgreSQL para salvar os dados.

## Funcionalidades

- Cadastro de doadores e resgatadores;
- Login simples por e-mail e senha;
- Cadastro de doações;
- Upload de fotos das doações;
- Listagem de doações;
- Pesquisa por alimento, doador, endereço ou bairro;
- Filtro por categoria e status;
- Edição de doações;
- Exclusão de doações;
- Reserva e confirmação da retirada de uma doação;
- Senhas armazenadas com hash usando `bcryptjs`.

## Como o projeto funciona

O funcionamento principal é:

1. A pessoa cria uma conta como doador ou resgatador.
2. O doador cadastra um alimento na tela de gerenciamento.
3. O alimento fica salvo no banco de dados.
4. A página inicial e a página de doações buscam os alimentos no banco.
5. O resgatador pode reservar a doação.
6. O status muda para mostrar se a doação está disponível, reservada ou resgatada.

As fotos enviadas no cadastro ficam na pasta `public/uploads/doacoes`.

## Estrutura do projeto

```text
foodshare/
├── public/                    # Tudo que é exibido no navegador
│   ├── css/
│   │   └── foodshare.css
│   ├── imagens/
│   ├── js/
│   │   ├── api.js
│   │   ├── componentes.js
│   │   ├── home.js
│   │   ├── doacoes.js
│   │   ├── cadastro.js
│   │   ├── login.js
│   │   ├── gerenciar-doacoes.js
│   │   └── meu-pedido.js
│   ├── index.html
│   ├── doacoes.html
│   ├── cadastro.html
│   ├── login.html
│   ├── gerenciar-doacoes.html
│   └── meu-pedido.html
├── scripts/
│   └── init-db.js             # Executa o arquivo SQL
├── sql/
│   └── init.sql               # Cria as tabelas do banco
├── src/
│   ├── routes/
│   │   ├── doacoes.js
│   │   └── usuarios.js
│   ├── database.js
│   ├── server.js
│   └── validacoes.js
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

## Pré-requisitos

Instale:

- Node.js 18 ou superior;
- Docker ou Podman;
- Docker Compose ou Podman Compose.

## Como executar

### 1. Entrar na pasta

```bash
cd foodshare
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo de configuração

Linux ou macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Iniciar o PostgreSQL

Com Docker:

```bash
docker compose up -d
```

Com Podman:

```bash
podman compose up -d
```

### 5. Criar as tabelas

```bash
npm run db:init
```

### 6. Iniciar a aplicação

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Páginas principais

| Página | Endereço |
|---|---|
| Página inicial | `http://localhost:3000` |
| Explorar doações | `http://localhost:3000/doacoes.html` |
| Cadastro de usuário | `http://localhost:3000/cadastro.html` |
| Login | `http://localhost:3000/login.html` |
| Gerenciar doações | `http://localhost:3000/gerenciar-doacoes.html` |
| Pedido selecionado | `http://localhost:3000/meu-pedido.html` |

## Banco de dados

O projeto possui duas tabelas:

### `usuarios`

Armazena doadores e resgatadores:

- Nome;
- CPF;
- Telefone;
- E-mail;
- Hash da senha;
- Tipo de usuário.

### `doacoes`

Armazena as informações das doações:

- Nome do alimento;
- Descrição;
- Categoria;
- Quantidade;
- Data de validade;
- Endereço;
- Bairro;
- Doador;
- Telefone;
- Imagem;
- Status.

## Observação sobre autenticação

O login valida e-mail e senha, mas ainda é simples. Ele não controla permissões completas entre usuários.

Os dados públicos do usuário ficam no `localStorage` apenas para preencher automaticamente o formulário de doação.

## Comandos úteis

Ver os containers:

```bash
docker compose ps
```

Ver os logs do PostgreSQL:

```bash
docker compose logs postgres
```

Parar o banco:

```bash
docker compose down
```

Apagar também os dados do banco e começar novamente:

```bash
docker compose down -v
docker compose up -d
npm run db:init
```

## Problemas comuns

### A porta 5432 já está sendo usada

Altere no `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"
```

Depois altere no `.env`:

```text
DB_PORT=5433
```

### Erro `password authentication failed`

Confira se os valores do `.env` são iguais aos definidos no `docker-compose.yml`.

### A página abre, mas as doações não aparecem

Confirme se:

1. O PostgreSQL está iniciado;
2. O comando `npm run db:init` foi executado;
3. O servidor Node.js está rodando;
4. A página foi aberta por `http://localhost:3000`, e não diretamente pelo arquivo HTML.
