const conteudoPedido = document.getElementById('conteudo-pedido');
const mensagemPedido = document.getElementById('mensagem-pedido');
const idSelecionado = localStorage.getItem('foodshareDoacaoSelecionada');

function adicionarDetalhe(container, titulo, valor) {
  const detalhe = document.createElement('div');
  detalhe.className = 'order-detail';

  const rotulo = document.createElement('strong');
  rotulo.textContent = `${titulo}: `;

  const texto = document.createElement('span');
  texto.textContent = valor;

  detalhe.append(rotulo, texto);
  container.appendChild(detalhe);
}

function renderizarPedido(doacao) {
  conteudoPedido.replaceChildren();

  const card = document.createElement('section');
  card.className = 'order-card';

  const imagem = document.createElement('img');
  imagem.className = 'order-image';
  imagem.src = doacao.imagem_url || '/imagens/resgate-express.svg';
  imagem.alt = doacao.nome_alimento;
  imagem.addEventListener('error', () => {
    imagem.src = '/imagens/resgate-express.svg';
  });

  const dados = document.createElement('div');
  dados.className = 'order-content';

  const titulo = document.createElement('h1');
  titulo.textContent = doacao.nome_alimento;

  const descricao = document.createElement('p');
  descricao.className = 'texto-apoio';
  descricao.textContent = doacao.descricao || 'Sem descrição adicional.';

  dados.append(titulo, descricao);
  adicionarDetalhe(dados, 'Quantidade', String(doacao.quantidade));
  adicionarDetalhe(dados, 'Validade', foodShareUi.formatarData(doacao.data_validade));
  adicionarDetalhe(dados, 'Retirada', doacao.endereco);
  adicionarDetalhe(dados, 'Doador', doacao.nome_doador);
  adicionarDetalhe(dados, 'Telefone', doacao.telefone_doador);
  adicionarDetalhe(dados, 'Status', foodShareUi.NOMES_STATUS[doacao.status] || doacao.status);

  const acoes = document.createElement('div');
  acoes.className = 'form-actions';

  if (doacao.status === 'DISPONIVEL') {
    const reservar = document.createElement('button');
    reservar.className = 'btn';
    reservar.type = 'button';
    reservar.textContent = 'Reservar para retirada';
    reservar.addEventListener('click', () => alterarStatus(doacao.id, 'RESERVADA'));
    acoes.appendChild(reservar);
  }

  if (doacao.status === 'RESERVADA') {
    const concluir = document.createElement('button');
    concluir.className = 'btn';
    concluir.type = 'button';
    concluir.textContent = 'Confirmar retirada';
    concluir.addEventListener('click', () => alterarStatus(doacao.id, 'RESGATADA'));

    const cancelar = document.createElement('button');
    cancelar.className = 'btn btn-neutral';
    cancelar.type = 'button';
    cancelar.textContent = 'Cancelar reserva';
    cancelar.addEventListener('click', () => alterarStatus(doacao.id, 'DISPONIVEL'));

    acoes.append(concluir, cancelar);
  }

  const voltar = document.createElement('a');
  voltar.className = 'btn btn-secondary';
  voltar.href = 'doacoes.html';
  voltar.textContent = 'Continuar explorando';
  acoes.appendChild(voltar);

  dados.appendChild(acoes);
  card.append(imagem, dados);
  conteudoPedido.appendChild(card);
}

async function alterarStatus(id, status) {
  try {
    const doacao = await foodShareApi.alterarStatus(id, status);
    foodShareUi.exibirMensagem(mensagemPedido, 'Status atualizado com sucesso.', 'success');
    renderizarPedido(doacao);
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemPedido, erro.message, 'error');
  }
}

async function carregarPedido() {
  if (!idSelecionado) {
    conteudoPedido.innerHTML = '<div class="empty-state">Selecione uma doação na página de alimentos.</div>';
    return;
  }

  try {
    const doacao = await foodShareApi.buscarDoacao(idSelecionado);
    renderizarPedido(doacao);
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemPedido, erro.message, 'error');
  }
}

carregarPedido();
