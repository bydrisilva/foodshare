const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pool = require('../database');
const {
  CATEGORIAS,
  STATUS_DOACAO,
  possuiTexto,
  validarDoacao,
} = require('../validacoes');

const router = express.Router();

const pastaUploads = path.join(__dirname, '..', '..', 'public', 'uploads', 'doacoes');
fs.mkdirSync(pastaUploads, { recursive: true });

// O multer recebe a foto enviada pelo formulário e salva na pasta de uploads.
const upload = multer({
  storage: multer.diskStorage({
    destination: pastaUploads,
    filename(req, file, callback) {
      const extensao = path.extname(file.originalname).toLowerCase();
      const nome = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;
      callback(null, nome);
    },
  }),
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Envie um arquivo de imagem válido.'));
    }

    return callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function removerArquivoEnviado(arquivo) {
  if (!arquivo) return;
  fs.unlink(arquivo.path, (erro) => {
    if (erro) console.error('Não foi possível remover upload inválido:', erro);
  });
}

function imagemRecebida(req) {
  return req.file ? `/uploads/doacoes/${req.file.filename}` : null;
}

function montarDoacao(body) {
  return {
    nome_alimento: body.nome_alimento?.trim(),
    descricao: body.descricao?.trim() || null,
    categoria: body.categoria,
    quantidade: Number(body.quantidade),
    data_validade: body.data_validade,
    endereco: body.endereco?.trim(),
    bairro: body.bairro?.trim() || null,
    nome_doador: body.nome_doador?.trim(),
    telefone_doador: body.telefone_doador?.trim(),
    imagem_url: body.imagem_url?.trim() || null,
    status: body.status || 'DISPONIVEL',
  };
}

router.get('/', async (req, res, next) => {
  try {
    const { busca, categoria, status } = req.query;
    const filtros = [];
    const valores = [];

    if (possuiTexto(busca)) {
      valores.push(`%${busca.trim()}%`);
      filtros.push(`(
        nome_alimento ILIKE $${valores.length}
        OR descricao ILIKE $${valores.length}
        OR nome_doador ILIKE $${valores.length}
        OR endereco ILIKE $${valores.length}
        OR bairro ILIKE $${valores.length}
      )`);
    }

    if (possuiTexto(categoria) && CATEGORIAS.includes(categoria)) {
      valores.push(categoria);
      filtros.push(`categoria = $${valores.length}`);
    }

    if (possuiTexto(status) && STATUS_DOACAO.includes(status)) {
      valores.push(status);
      filtros.push(`status = $${valores.length}`);
    }

    const where = filtros.length > 0
      ? `WHERE ${filtros.join(' AND ')}`
      : '';

    const resultado = await pool.query(
      `SELECT *
       FROM doacoes
       ${where}
       ORDER BY criado_em DESC`,
      valores,
    );

    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM doacoes WHERE id = $1',
      [req.params.id],
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Doação não encontrada.' });
    }

    return res.json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
});

router.post('/', upload.single('imagem'), async (req, res, next) => {
  try {
    const doacao = montarDoacao(req.body);
    doacao.imagem_url = imagemRecebida(req) || doacao.imagem_url;
    const erros = validarDoacao(doacao);

    if (erros.length > 0) {
      removerArquivoEnviado(req.file);
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    const resultado = await pool.query(
      `INSERT INTO doacoes (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        doacao.nome_alimento,
        doacao.descricao,
        doacao.categoria,
        doacao.quantidade,
        doacao.data_validade,
        doacao.endereco,
        doacao.bairro,
        doacao.nome_doador,
        doacao.telefone_doador,
        doacao.imagem_url,
        doacao.status,
      ],
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
});

router.put('/:id', upload.single('imagem'), async (req, res, next) => {
  try {
    const doacao = montarDoacao(req.body);
    doacao.imagem_url = imagemRecebida(req) || doacao.imagem_url;
    const erros = validarDoacao(doacao);

    if (erros.length > 0) {
      removerArquivoEnviado(req.file);
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    const resultado = await pool.query(
      `UPDATE doacoes
       SET nome_alimento = $1,
           descricao = $2,
           categoria = $3,
           quantidade = $4,
           data_validade = $5,
           endereco = $6,
           bairro = $7,
           nome_doador = $8,
           telefone_doador = $9,
           imagem_url = $10,
           status = $11,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        doacao.nome_alimento,
        doacao.descricao,
        doacao.categoria,
        doacao.quantidade,
        doacao.data_validade,
        doacao.endereco,
        doacao.bairro,
        doacao.nome_doador,
        doacao.telefone_doador,
        doacao.imagem_url,
        doacao.status,
        req.params.id,
      ],
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Doação não encontrada.' });
    }

    return res.json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!STATUS_DOACAO.includes(status)) {
      return res.status(400).json({ mensagem: 'Status inválido.' });
    }

    const resultado = await pool.query(
      `UPDATE doacoes
       SET status = $1,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id],
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Doação não encontrada.' });
    }

    return res.json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'DELETE FROM doacoes WHERE id = $1 RETURNING id',
      [req.params.id],
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Doação não encontrada.' });
    }

    return res.status(204).send();
  } catch (erro) {
    return next(erro);
  }
});

module.exports = router;
