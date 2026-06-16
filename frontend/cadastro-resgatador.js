/**
 * FoodShare - Cadastro de Resgatador
 * Lógica de validação e formatação de campos
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. MÁSCARAS DE ENTRADA (Formatação em tempo real)
  const inputCpf = document.getElementById('cpf');
  const inputTelefone = document.getElementById('telefone');

  if (inputCpf) {
    inputCpf.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Remove tudo o que não for número
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    });
  }

  if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      e.target.value = value;
    });
  }

  // 2. FUNÇÃO DE VALIDAÇÃO MATEMÁTICA DE CPF
  const validarCPF = (cpf) => {
    const limpo = cpf.replace(/[^\d]+/g, '');
    if (limpo === '' || limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) return false;
    
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(limpo.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(limpo.charAt(9))) return false;
    
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(limpo.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(limpo.charAt(10))) return false;
    
    return true;
  };

  // 3. VALIDAÇÃO AO ENVIAR O FORMULÁRIO (SUBMIT)
  const formResgatador = document.getElementById('resgatador-form');

  if (formResgatador) {
    formResgatador.addEventListener('submit', async (e) => {
      e.preventDefault();
      let formValido = true;

      // Elementos do formulário
      const nome = document.getElementById('nome');
      const cpf = document.getElementById('cpf');
      const telefone = document.getElementById('telefone');
      const email = document.getElementById('email');
      const senha = document.getElementById('senha');
      const confirma = document.getElementById('confirma-senha');

      // Limpar erros prévios
      document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
      document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

      const mostrarErro = (elemento, idMsg) => {
        elemento.classList.add('error');
        const msg = document.getElementById(idMsg);
        if (msg) msg.style.display = 'block';
        formValido = false;
      };

      // Validação de Nome (Mínimo nome e sobrenome)
      if (nome.value.trim().split(/\s+/).length < 2) {
        mostrarErro(nome, 'error-nome');
      }

      // Validação de CPF
      if (!validarCPF(cpf.value)) {
        mostrarErro(cpf, 'error-cpf');
      }

      // Validação de Telefone
      if (telefone.value.length < 14) {
        mostrarErro(telefone, 'error-telefone');
      }

      // Validação de E-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        mostrarErro(email, 'error-email');
      }

      // Validação de Senha
      if (senha.value.length < 6) {
        mostrarErro(senha, 'error-senha');
      }

      // Validação Confirmação de Senha
      if (senha.value !== confirma.value || confirma.value === '') {
        mostrarErro(confirma, 'error-confirma');
      }

      // Processamento final (Integração com o Backend)
      if (formValido) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/cadastro', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nome: nome.value,
              cpf: cpf.value,
              telefone: telefone.value,
              email: email.value,
              senha: senha.value,
              tipo: 'resgatador'
            })
          });

          const data = await response.json();

          if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = 'login.html';
          } else {
            alert(data.error || 'Erro ao realizar cadastro.');
          }
        } catch (error) {
          console.error('Erro na requisição de cadastro:', error);
          alert('Erro de conexão com o servidor. Certifique-se de que o backend está rodando.');
        }
      }
    });
  }
});
