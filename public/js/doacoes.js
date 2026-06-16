const gradeDoacoes = document.getElementById('grade-doacoes');
const buscaDoacoes = document.getElementById('busca-doacoes');
const statusDoacoes = document.getElementById('status-doacoes');
const botaoFiltrar = document.getElementById('botao-filtrar');
const tituloCategoria = document.getElementById('titulo-categoria');
const textoCategoria = document.getElementById('texto-categoria');
const iconeCategoria = document.getElementById('icone-categoria');

const configuracaoCategorias = {
  LANCHE: { titulo: 'Lanches', icone: '🥪', texto: 'Salgados, pães e lanches disponíveis para retirada.' },
  ALMOCO: { titulo: 'Almoços', icone: '🍽️', texto: 'Refeições e marmitas disponíveis para retirada.' },
  JANTAR: { titulo: 'Jantares', icone: '🌙', texto: 'Refeições disponíveis para o período da noite.' },
  OUTRO: { titulo: 'Outros alimentos', icone: '🥦', texto: 'Verduras, ingredientes e outros alimentos.' },
};

const parametrosUrl = new URLSearchParams(window.location.search);
const categoria = parametrosUrl.get('categoria') || '';
const statusInicial = parametrosUrl.get('status') || 'DISPONIVEL';

function configurarCabecalhoCategoria() {
  document.querySelectorAll('.cat-pill').forEach((link) => {
    const parametrosLink = new URL(link.href).searchParams;
    const categoriaLink = parametrosLink.get('categoria') || '';
    link.classList.toggle('active', categoriaLink === categoria);
  });
  const configuracao = configuracaoCategorias[categoria];

  if (!configuracao) {
    tituloCategoria.textContent = 'Todos os alimentos';
    textoCategoria.textContent = 'Consulte as doações cadastradas no FoodShare.';
    iconeCategoria.textContent = '🍱';
    return;
  }

  tituloCategoria.textContent = configuracao.titulo;
  textoCategoria.textContent = configuracao.texto;
  iconeCategoria.textContent = configuracao.icone;
}

async function carregarDoacoes() {
  foodShareUi.mostrarEstado(gradeDoacoes, 'Carregando doações...', 'loading-state');

  try {
    const doacoes = await foodShareApi.listarDoacoes({
      busca: buscaDoacoes.value,
      categoria,
      status: statusDoacoes.value,
    });

    foodShareUi.renderizarCards(gradeDoacoes, doacoes);
  } catch (erro) {
    foodShareUi.mostrarEstado(gradeDoacoes, erro.message);
  }
}

botaoFiltrar.addEventListener('click', carregarDoacoes);
statusDoacoes.addEventListener('change', carregarDoacoes);

buscaDoacoes.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') carregarDoacoes();
});

statusDoacoes.value = statusInicial;
configurarCabecalhoCategoria();
carregarDoacoes();
