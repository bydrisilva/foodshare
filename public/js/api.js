const API_BASE = '/api';

async function requisicao(caminho, opcoes = {}) {
  const headers = opcoes.body instanceof FormData
    ? (opcoes.headers || {})
    : {
      'Content-Type': 'application/json',
      ...(opcoes.headers || {}),
    };

  const resposta = await fetch(`${API_BASE}${caminho}`, {
    ...opcoes,
    headers,
  });

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    const detalhes = Array.isArray(dados.erros)
      ? ` ${dados.erros.join(' ')}`
      : '';

    throw new Error(`${dados.mensagem || 'Não foi possível concluir a operação.'}${detalhes}`);
  }

  return dados;
}

function montarParametros(filtros = {}) {
  const parametros = new URLSearchParams();

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
      parametros.set(chave, valor);
    }
  });

  const texto = parametros.toString();
  return texto ? `?${texto}` : '';
}

window.foodShareApi = {
  listarDoacoes(filtros) {
    return requisicao(`/doacoes${montarParametros(filtros)}`);
  },

  buscarDoacao(id) {
    return requisicao(`/doacoes/${id}`);
  },

  criarDoacao(doacao) {
    return requisicao('/doacoes', {
      method: 'POST',
      body: doacao instanceof FormData ? doacao : JSON.stringify(doacao),
    });
  },

  atualizarDoacao(id, doacao) {
    return requisicao(`/doacoes/${id}`, {
      method: 'PUT',
      body: doacao instanceof FormData ? doacao : JSON.stringify(doacao),
    });
  },

  alterarStatus(id, status) {
    return requisicao(`/doacoes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  excluirDoacao(id) {
    return requisicao(`/doacoes/${id}`, { method: 'DELETE' });
  },

  cadastrarUsuario(usuario) {
    return requisicao('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  },

  login(email, senha) {
    return requisicao('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },
};
