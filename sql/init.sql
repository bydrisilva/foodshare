-- =========================================================
-- FOODSHARE - CRIAÇÃO DO BANCO DE DADOS
-- Execute este arquivo por meio do comando: npm run db:init
-- =========================================================

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

-- Esta é a tabela utilizada no CRUD obrigatório do trabalho.
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

-- Insere dados de demonstração somente quando a tabela estiver vazia.
INSERT INTO doacoes (
    nome_alimento,
    descricao,
    categoria,
    quantidade,
    data_validade,
    endereco,
    bairro,
    nome_doador,
    telefone_doador,
    imagem_url,
    status
)
SELECT * FROM (
    VALUES
      (
        'Pão de queijo',
        'Porções preparadas hoje e prontas para retirada.',
        'LANCHE',
        10,
        CURRENT_DATE + 2,
        'QR 401, Samambaia Norte',
        'Samambaia Norte',
        'Padaria do Zé',
        '(61) 99999-0001',
        '/imagens/pao-de-queijo.svg',
        'DISPONIVEL'
      ),
      (
        'Brócolis e couve',
        'Verduras frescas que não serão utilizadas no estabelecimento.',
        'OUTRO',
        6,
        CURRENT_DATE + 3,
        'QR 211, Samambaia Norte',
        'Samambaia Norte',
        'Quitanda da Ana',
        '(61) 99999-0002',
        '/imagens/verduras.svg',
        'DISPONIVEL'
      ),
      (
        'Marmita de frango',
        'Marmitas preparadas no dia.',
        'ALMOCO',
        4,
        CURRENT_DATE + 1,
        'QR 307, Samambaia Sul',
        'Samambaia Sul',
        'Restaurante Prato Cheio',
        '(61) 99999-0003',
        '/imagens/marmita.svg',
        'DISPONIVEL'
      ),
      (
        'Sopa com legumes',
        'Porções individuais para retirada no período da noite.',
        'JANTAR',
        5,
        CURRENT_DATE + 1,
        'QR 407, Samambaia Norte',
        'Samambaia Norte',
        'Cantinho Paulista',
        '(61) 99999-0004',
        '/imagens/sopa.svg',
        'DISPONIVEL'
      )
) AS dados(
    nome_alimento,
    descricao,
    categoria,
    quantidade,
    data_validade,
    endereco,
    bairro,
    nome_doador,
    telefone_doador,
    imagem_url,
    status
)
WHERE NOT EXISTS (SELECT 1 FROM doacoes);
