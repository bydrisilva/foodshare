CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('DOADOR', 'RESGATADOR')),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doacoes (
    id SERIAL PRIMARY KEY,
    nome_alimento VARCHAR(120) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(20) NOT NULL CHECK (
        categoria IN ('LANCHE', 'ALMOCO', 'JANTAR', 'OUTRO')
    ),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    data_validade DATE NOT NULL,
    endereco VARCHAR(220) NOT NULL,
    bairro VARCHAR(100),
    nome_doador VARCHAR(120) NOT NULL,
    telefone_doador VARCHAR(20) NOT NULL,
    imagem_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL' CHECK (
        status IN ('DISPONIVEL', 'RESERVADA', 'RESGATADA')
    ),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE doacoes
    ALTER COLUMN imagem_url TYPE TEXT;
