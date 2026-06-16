require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../src/database');

async function inicializarBanco() {
  try {
    const caminhoSql = path.join(__dirname, '..', 'sql', 'init.sql');
    const sql = fs.readFileSync(caminhoSql, 'utf8');

    await pool.query(sql);
    console.log('Banco de dados inicializado com sucesso.');
  } catch (erro) {
    console.error('Não foi possível inicializar o banco de dados.');
    console.error(erro);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

inicializarBanco();
