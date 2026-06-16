// 1. MÁSCARAS DE ENTRADA (Formatação em tempo real)
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');

if (inputCpf) {
  inputCpf.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo o que não for número
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
  });
}

if (inputTelefone) {
  inputTelefone.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
  });
}

// 2. FUNÇÃO DE VALIDAÇÃO MATEMÁTICA DE CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf == '' || cpf.length != 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Rejeita CPFs como 111.111.111-11
  
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// 3. VALIDAÇÃO AO ENVIAR O FORMULÁRIO (SUBMIT)
const formResgatador = document.getElementById('resgatador-form');

if (formResgatador) {
  formResgatador.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão da página
    let formValido = true;

    // Pegando os campos
    const nome = document.getElementById('nome');
    const cpf = document.getElementById('cpf');
    const telefone = document.getElementById('telefone');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const confirma = document.getElementById('confirma-senha');

    // Limpar erros prévios
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

    function mostrarErro(elemento, idMsg) {
      elemento.classList.add('error');
      document.getElementById(idMsg).style.display = 'block';
      formValido = false;
    }

    // Validação de Nome
    if (nome.value.trim().split(' ').length < 2) mostrarErro(nome, 'error-nome');

    // Validação de CPF
    if (!validarCPF(cpf.value)) mostrarErro(cpf, 'error-cpf');

    // Validação de Telefone (Exige pelo menos 14 caracteres: (XX) XXXXX-XXXX)
    if (telefone.value.length < 14) mostrarErro(telefone, 'error-telefone');

    // Validação de E-mail simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) mostrarErro(email, 'error-email');

    // Validação de Senha
    if (senha.value.length < 6) mostrarErro(senha, 'error-senha');

    // Validação Confirmação de Senha
    if (senha.value !== confirma.value || confirma.value === '') mostrarErro(confirma, 'error-confirma');

    // SE TUDO ESTIVER CORRETO (Pronto para o Banco de Dados)
    if (formValido) {
      /* AQUI ENTRARÁ O SEU CÓDIGO DE BACKEND (FETCH/AXIOS PARA O BANCO DE DADOS) */
      
      // Simulação de Sucesso:
      alert("Cadastro realizado com sucesso! Bem-vindo ao FoodShare.");
      window.location.href = 'index.html'; // Redireciona o usuário para a Home
    }
  });
}