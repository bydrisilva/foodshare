require('dotenv').config();

const path = require('path');
const express = require('express');
const pool = require('./database');
const doacoesRoutes = require('./routes/doacoes');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const porta = Number(process.env.PORT || 3000);

/* Permite receber objetos JSON enviados pelo front-end. */
app.use(express.json());

/* Publica os arquivos HTML, CSS, JavaScript e imagens da pasta public. */
app.use(express.static(path.join(__dirname, '..', 'public')));

/* Rotas da API. */
app.use('/api/doacoes', doacoesRoutes);
app.use('/api/usuarios', usuariosRoutes);

/* Rota simples para testar a aplicação e a conexão com o banco. */
app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', mensagem: 'Aplicação e PostgreSQL funcionando.' });
  } catch (erro) {
    next(erro);
  }
});

/*
 * Tratamento central de erros.
 * O detalhe completo aparece apenas no terminal, e não para o usuário.
 */
app.use((erro, req, res, next) => {
  console.error(erro);

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
