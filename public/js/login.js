const formularioLogin = document.getElementById('form-login');
const mensagemLogin = document.getElementById('mensagem-login');

formularioLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  foodShareUi.limparMensagem(mensagemLogin);

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const usuario = await foodShareApi.login(email, senha);

    /*
     * Armazena apenas dados públicos do usuário no navegador.
     * Isso ajuda a preencher o formulário de doação no MVP.
     */
    localStorage.setItem('foodshareUsuario', JSON.stringify(usuario));

    foodShareUi.exibirMensagem(
      mensagemLogin,
      `Bem-vindo(a), ${usuario.nome}!`,
      'success',
    );

    setTimeout(() => {
      window.location.href = usuario.tipo === 'DOADOR'
        ? 'gerenciar-doacoes.html'
        : 'doacoes.html';
    }, 700);
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemLogin, erro.message, 'error');
  }
});
