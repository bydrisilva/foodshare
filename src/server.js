require('dotenv').config();

const path = require('path');
const express = require('express');
const pool = require('./database');
const doacoesRoutes = require('./routes/doacoes');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const porta = Number(process.env.PORT || 3000);

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/doacoes', doacoesRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', mensagem: 'Aplicação e PostgreSQL funcionando.' });
  } catch (erro) {
    next(erro);
  }
});

app.use((erro, req, res, next) => {
  console.error(erro);

  if (erro.name === 'MulterError') {
    const mensagem = erro.code === 'LIMIT_FILE_SIZE'
      ? 'A imagem deve ter no máximo 5 MB.'
      : 'Não foi possível receber a imagem enviada.';

    return res.status(400).json({ mensagem });
  }

  if (erro.message === 'Envie um arquivo de imagem válido.') {
    return res.status(400).json({ mensagem: erro.message });
  }

  if (erro.code === '23505') {
    return res.status(409).json({
      mensagem: 'Já existe um cadastro com uma informação que deve ser única.',
    });
  }

  return res.status(500).json({
    mensagem: 'Ocorreu um erro interno. Tente novamente.',
  });
});

app.listen(porta, () => {
  console.log(`FoodShare disponível em http://localhost:${porta}`);
});
