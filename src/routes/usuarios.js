const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../database');
const { validarUsuario } = require('../validacoes');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const usuario = {
      nome: req.body.nome?.trim(),
      cpf: req.body.cpf?.trim(),
      telefone: req.body.telefone?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      senha: req.body.senha,
      tipo: req.body.tipo,
    };

    const erros = validarUsuario(usuario);

    if (erros.length > 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
    }

    const senhaHash = await bcrypt.hash(usuario.senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, cpf, telefone, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, cpf, telefone, email, tipo, criado_em`,
      [
        usuario.nome,
        usuario.cpf,
        usuario.telefone,
        usuario.email,
        senhaHash,
        usuario.tipo,
      ],
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    return next(erro);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const senha = req.body.senha;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    }

    const resultado = await pool.query(
      `SELECT id, nome, cpf, telefone, email, senha_hash, tipo
       FROM usuarios
       WHERE email = $1`,
      [email],
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    delete usuario.senha_hash;
    return res.json(usuario);
  } catch (erro) {
    return next(erro);
  }
});

module.exports = router;
