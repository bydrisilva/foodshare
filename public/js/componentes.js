const EMOJIS_CATEGORIA = {
  LANCHE: '🥪',
  ALMOCO: '🍽️',
  JANTAR: '🌙',
  OUTRO: '🥦',
};

const NOMES_STATUS = {
  DISPONIVEL: 'Disponível',
  RESERVADA: 'Reservada',
  RESGATADA: 'Resgatada',
};

function formatarData(data) {
  if (!data) return 'Não informada';

  return new Date(`${data.substring(0, 10)}T12:00:00`).toLocaleDateString('pt-BR');
}

function selecionarDoacao(id) {
  localStorage.setItem('foodshareDoacaoSelecionada', String(id));
}

function criarCardDoacao(doacao) {
  const link = document.createElement('a');
  link.className = 'food-card';
  link.href = 'meu-pedido.html';
  link.addEventListener('click', () => selecionarDoacao(doacao.id));

  const imagemWrapper = document.createElement('div');
  imagemWrapper.className = 'food-card-img-wrap';

  if (doacao.imagem_url) {
    const imagem = document.createElement('img');
    imagem.className = 'food-card-img';
    imagem.src = doacao.imagem_url;
    imagem.alt = doacao.nome_alimento;

    imagem.addEventListener('error', () => {
      imagem.remove();
      imagemWrapper.prepend(criarEmoji(doacao.categoria));
    });

    imagemWrapper.appendChild(imagem);
  } else {
    imagemWrapper.appendChild(criarEmoji(doacao.categoria));
  }

  const endereco = document.createElement('div');
  endereco.className = 'food-card-tag';
  endereco.textContent = doacao.bairro || doacao.endereco;

  const quantidade = document.createElement('div');
  quantidade.className = 'food-card-count';
  quantidade.textContent = doacao.quantidade;
  quantidade.title = 'Quantidade disponível';

  const status = document.createElement('div');
  status.className = `food-card-status ${doacao.status.toLowerCase()}`;
  status.textContent = NOMES_STATUS[doacao.status] || doacao.status;

  imagemWrapper.append(endereco, quantidade, status);

  const corpo = document.createElement('div');
  corpo.className = 'food-card-body';

  const nome = document.createElement('div');
  nome.className = 'food-card-name';
  nome.textContent = doacao.nome_alimento;

  const local = document.createElement('div');
  local.className = 'food-card-place';
  local.textContent = doacao.nome_doador;

  const detalhes = document.createElement('div');
  detalhes.className = 'food-card-details';
  detalhes.textContent = `Validade: ${formatarData(doacao.data_validade)}`;

  corpo.append(nome, local, detalhes);
  link.append(imagemWrapper, corpo);

  return link;
}

function criarEmoji(categoria) {
  const emoji = document.createElement('span');
  emoji.className = 'food-card-emoji';
  emoji.textContent = EMOJIS_CATEGORIA[categoria] || '🍱';
  return emoji;
}

function mostrarEstado(container, texto, classe = 'empty-state') {
  container.replaceChildren();
  const mensagem = document.createElement('div');
  mensagem.className = classe;
  mensagem.textContent = texto;
  container.appendChild(mensagem);
}

function renderizarCards(container, doacoes) {
  container.replaceChildren();

  if (!doacoes.length) {
    mostrarEstado(container, 'Nenhuma doação foi encontrada.');
    return;
  }

  doacoes.forEach((doacao) => {
    container.appendChild(criarCardDoacao(doacao));
  });
}

function exibirMensagem(elemento, texto, tipo = 'info') {
  elemento.textContent = texto;
  elemento.className = `message show ${tipo}`;
}

function limparMensagem(elemento) {
  elemento.textContent = '';
  elemento.className = 'message';
}

window.foodShareUi = {
  NOMES_STATUS,
  formatarData,
  renderizarCards,
  mostrarEstado,
  exibirMensagem,
  limparMensagem,
};
