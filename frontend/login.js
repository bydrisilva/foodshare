document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Impede o recarregamento da página

      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
          // Salva o token no localStorage
          localStorage.setItem('token', data.token);
          // Redireciona para a página inicial
          window.location.href = 'index.html';
        } else {
          // Exibe o erro retornado pelo backend (ex: Credenciais inválidas)
          alert(data.error || 'Erro ao realizar login. Verifique suas credenciais.');
        }
      } catch (error) {
        console.error('Erro na requisição de login:', error);
        alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      }
    });
  }
});
