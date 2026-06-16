const gradeHome = document.getElementById('grade-home');
const buscaHome = document.getElementById('busca-home');
const botaoBuscaHome = document.getElementById('botao-busca-home');

async function carregarHome() {
  foodShareUi.mostrarEstado(gradeHome, 'Carregando doações...', 'loading-state');

  try {
    const doacoes = await foodShareApi.listarDoacoes({
      busca: buscaHome.value,
      status: 'DISPONIVEL',
    });

    /* Na página inicial mostramos somente os seis registros mais recentes. */
    foodShareUi.renderizarCards(gradeHome, doacoes.slice(0, 6));
  } catch (erro) {
    foodShareUi.mostrarEstado(gradeHome, erro.message);
  }
}

botaoBuscaHome.addEventListener('click', carregarHome);

buscaHome.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    carregarHome();
  }
});

carregarHome();
