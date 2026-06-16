const formularioCadastro = document.getElementById('form-cadastro');
const mensagemCadastro = document.getElementById('mensagem-cadastro');
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');

/* Máscara simples para CPF. */
inputCpf.addEventListener('input', (evento) => {
  let valor = evento.target.value.replace(/\D/g, '').slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  evento.target.value = valor;
});

/* Máscara simples para telefone brasileiro. */
inputTelefone.addEventListener('input', (evento) => {
  let valor = evento.target.value.replace(/\D/g, '').slice(0, 11);
  valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  evento.target.value = valor;
});

formularioCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  foodShareUi.limparMensagem(mensagemCadastro);

  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha').value;

  if (senha !== confirmarSenha) {
    foodShareUi.exibirMensagem(mensagemCadastro, 'As senhas não coincidem.', 'error');
    return;
  }

  const usuario = {
    nome: document.getElementById('nome').value,
    cpf: inputCpf.value,
    telefone: inputTelefone.value,
    email: document.getElementById('email').value,
    senha,
    tipo: document.getElementById('tipo').value,
  };

  try {
    await foodShareApi.cadastrarUsuario(usuario);
    foodShareUi.exibirMensagem(
      mensagemCadastro,
      'Cadastro realizado. Agora você pode entrar no FoodShare.',
      'success',
    );
    formularioCadastro.reset();
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemCadastro, erro.message, 'error');
  }
});
