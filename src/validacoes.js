const CATEGORIAS = ['LANCHE', 'ALMOCO', 'JANTAR', 'OUTRO'];
const STATUS_DOACAO = ['DISPONIVEL', 'RESERVADA', 'RESGATADA'];
const TIPOS_USUARIO = ['DOADOR', 'RESGATADOR'];

function possuiTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function inteiroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0;
}

function dataValida(valor) {
  return possuiTexto(valor) && !Number.isNaN(Date.parse(`${valor}T00:00:00`));
}

function emailValido(valor) {
  return possuiTexto(valor) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarDoacao(doacao) {
  const erros = [];

  if (!possuiTexto(doacao.nome_alimento)) {
    erros.push('Informe o nome do alimento.');
  }

  if (!CATEGORIAS.includes(doacao.categoria)) {
    erros.push('Selecione uma categoria válida.');
  }

  if (!inteiroPositivo(doacao.quantidade)) {
    erros.push('A quantidade deve ser um número inteiro maior que zero.');
  }

  if (!dataValida(doacao.data_validade)) {
    erros.push('Informe uma data de validade válida.');
  }

  if (!possuiTexto(doacao.endereco)) {
    erros.push('Informe o endereço para retirada.');
  }

  if (!possuiTexto(doacao.nome_doador)) {
    erros.push('Informe o nome do doador ou estabelecimento.');
  }

  if (!possuiTexto(doacao.telefone_doador)) {
    erros.push('Informe o telefone do doador.');
  }

  if (!STATUS_DOACAO.includes(doacao.status)) {
    erros.push('Informe um status válido.');
  }

  return erros;
}

function validarUsuario(usuario) {
  const erros = [];

  if (!possuiTexto(usuario.nome)) {
    erros.push('Informe o nome completo.');
  }

  if (!possuiTexto(usuario.cpf)) {
    erros.push('Informe o CPF.');
  }

  if (!possuiTexto(usuario.telefone)) {
    erros.push('Informe o telefone.');
  }

  if (!emailValido(usuario.email)) {
    erros.push('Informe um e-mail válido.');
  }

  if (!possuiTexto(usuario.senha) || usuario.senha.length < 6) {
    erros.push('A senha deve possuir pelo menos 6 caracteres.');
  }

  if (!TIPOS_USUARIO.includes(usuario.tipo)) {
    erros.push('Selecione o tipo de usuário.');
  }

  return erros;
}

module.exports = {
  CATEGORIAS,
  STATUS_DOACAO,
  possuiTexto,
  validarDoacao,
  validarUsuario,
};
