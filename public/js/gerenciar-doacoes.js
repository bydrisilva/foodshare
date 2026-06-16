const formularioDoacao = document.getElementById('form-doacao');
const mensagemDoacao = document.getElementById('mensagem-doacao');
const corpoTabela = document.getElementById('corpo-tabela-doacoes');
const tituloFormulario = document.getElementById('titulo-formulario');
const botaoCancelar = document.getElementById('botao-cancelar');
const buscaGerenciamento = document.getElementById('busca-gerenciamento');
const statusGerenciamento = document.getElementById('status-gerenciamento');
const botaoFiltrarGerenciamento = document.getElementById('botao-filtrar-gerenciamento');

function lerUsuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem('foodshareUsuario'));
  } catch (erro) {
    return null;
  }
}

function preencherDadosDoUsuario() {
  const usuario = lerUsuarioSalvo();

  if (!usuario) return;

  document.getElementById('nome-doador').value = usuario.nome || '';
  document.getElementById('telefone-doador').value = usuario.telefone || '';
}

function lerFormulario() {
  return {
    nome_alimento: document.getElementById('nome-alimento').value,
    descricao: document.getElementById('descricao').value,
    categoria: document.getElementById('categoria').value,
    quantidade: document.getElementById('quantidade').value,
    data_validade: document.getElementById('data-validade').value,
    endereco: document.getElementById('endereco').value,
    bairro: document.getElementById('bairro').value,
    nome_doador: document.getElementById('nome-doador').value,
    telefone_doador: document.getElementById('telefone-doador').value,
    imagem_url: document.getElementById('imagem-url').value,
    status: document.getElementById('status').value,
  };
}

function limparFormulario() {
  formularioDoacao.reset();
  document.getElementById('doacao-id').value = '';
  document.getElementById('status').value = 'DISPONIVEL';
  tituloFormulario.textContent = 'Cadastrar nova doação';
  botaoCancelar.hidden = true;
  preencherDadosDoUsuario();
}

async function preencherFormularioParaEdicao(id) {
  try {
    const doacao = await foodShareApi.buscarDoacao(id);

    document.getElementById('doacao-id').value = doacao.id;
    document.getElementById('nome-alimento').value = doacao.nome_alimento;
    document.getElementById('descricao').value = doacao.descricao || '';
    document.getElementById('categoria').value = doacao.categoria;
    document.getElementById('quantidade').value = doacao.quantidade;
    document.getElementById('data-validade').value = doacao.data_validade.substring(0, 10);
    document.getElementById('endereco').value = doacao.endereco;
    document.getElementById('bairro').value = doacao.bairro || '';
    document.getElementById('nome-doador').value = doacao.nome_doador;
    document.getElementById('telefone-doador').value = doacao.telefone_doador;
    document.getElementById('imagem-url').value = doacao.imagem_url || '';
    document.getElementById('status').value = doacao.status;

    tituloFormulario.textContent = `Editar doação #${doacao.id}`;
    botaoCancelar.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemDoacao, erro.message, 'error');
  }
}

function criarBadgeStatus(status) {
  const badge = document.createElement('span');
  badge.className = `badge ${status.toLowerCase()}`;
  badge.textContent = foodShareUi.NOMES_STATUS[status] || status;
  return badge;
}

function criarBotao(texto, classe, acao) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = `btn btn-small ${classe}`;
  botao.textContent = texto;
  botao.addEventListener('click', acao);
  return botao;
}

function renderizarTabela(doacoes) {
  corpoTabela.replaceChildren();

  if (!doacoes.length) {
    const linha = document.createElement('tr');
    const celula = document.createElement('td');
    celula.colSpan = 6;
    celula.textContent = 'Nenhuma doação encontrada.';
    celula.style.textAlign = 'center';
    linha.appendChild(celula);
    corpoTabela.appendChild(linha);
    return;
  }

  doacoes.forEach((doacao) => {
    const linha = document.createElement('tr');

    const alimento = document.createElement('td');
    alimento.textContent = doacao.nome_alimento;

    const categoria = document.createElement('td');
    categoria.textContent = doacao.categoria;

    const quantidade = document.createElement('td');
    quantidade.textContent = doacao.quantidade;

    const validade = document.createElement('td');
    validade.textContent = foodShareUi.formatarData(doacao.data_validade);

    const status = document.createElement('td');
    status.appendChild(criarBadgeStatus(doacao.status));

    const acoes = document.createElement('td');
    const grupoAcoes = document.createElement('div');
    grupoAcoes.className = 'inline-actions';
    grupoAcoes.style.marginTop = '0';

    const editar = criarBotao('Editar', 'btn-secondary', () => {
      preencherFormularioParaEdicao(doacao.id);
    });

    const excluir = criarBotao('Excluir', 'btn-danger', async () => {
      const confirmou = window.confirm(`Deseja excluir "${doacao.nome_alimento}"?`);
      if (!confirmou) return;

      try {
        await foodShareApi.excluirDoacao(doacao.id);
        foodShareUi.exibirMensagem(mensagemDoacao, 'Doação excluída.', 'success');
        await carregarTabela();
      } catch (erro) {
        foodShareUi.exibirMensagem(mensagemDoacao, erro.message, 'error');
      }
    });

    grupoAcoes.append(editar, excluir);
    acoes.appendChild(grupoAcoes);
    linha.append(alimento, categoria, quantidade, validade, status, acoes);
    corpoTabela.appendChild(linha);
  });
}

async function carregarTabela() {
  try {
    const doacoes = await foodShareApi.listarDoacoes({
      busca: buscaGerenciamento.value,
      status: statusGerenciamento.value,
    });

    renderizarTabela(doacoes);
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemDoacao, erro.message, 'error');
  }
}

formularioDoacao.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  foodShareUi.limparMensagem(mensagemDoacao);

  const id = document.getElementById('doacao-id').value;
  const doacao = lerFormulario();

  try {
    if (id) {
      await foodShareApi.atualizarDoacao(id, doacao);
      foodShareUi.exibirMensagem(mensagemDoacao, 'Doação atualizada com sucesso.', 'success');
    } else {
      await foodShareApi.criarDoacao(doacao);
      foodShareUi.exibirMensagem(mensagemDoacao, 'Doação cadastrada com sucesso.', 'success');
    }

    limparFormulario();
    await carregarTabela();
  } catch (erro) {
    foodShareUi.exibirMensagem(mensagemDoacao, erro.message, 'error');
  }
});

botaoCancelar.addEventListener('click', limparFormulario);
botaoFiltrarGerenciamento.addEventListener('click', carregarTabela);
statusGerenciamento.addEventListener('change', carregarTabela);

buscaGerenciamento.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') carregarTabela();
});

preencherDadosDoUsuario();
carregarTabela();
