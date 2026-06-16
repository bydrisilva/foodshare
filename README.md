# FoodShare

> **Onde o excedente vira oportunidade.**

O **FoodShare** é uma plataforma de economia circular e impacto social que conecta estabelecimentos comerciais (padarias, restaurantes, mercados) que possuem excedentes de alimentos de qualidade a pessoas que buscam refeições com preços acessíveis ou doações. 

Nossa missão é combater o desperdício de alimentos de forma inteligente, rápida e eficiente, utilizando a tecnologia para fechar o ciclo entre quem tem e quem precisa.

---

## Sobre o Projeto

O FoodShare nasceu da urgência em reduzir os números alarmantes de desperdício global. Através de um **MVP (Minimum Viable Product)**, oferecemos uma experiência mobile intuitiva onde:

- **Estabelecimentos:** Podem cadastrar "Pacotes Surpresa" ou itens específicos que sobraram no dia, evitando o prejuízo e o descarte.
- **Usuários:** Localizam ofertas próximas por geolocalização, realizam o resgate pelo app e retiram o alimento diretamente no local.
- **Impacto:** Menos lixo orgânico, economia para o consumidor e sustentabilidade para o negócio.

---

## Tecnologias Utilizadas

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema JavaScript para garantir escalabilidade e performance:

### **Mobile (Frontend)**
- **React Native:** Framework para construção de interfaces nativas.
- **Expo:** Plataforma de ferramentas para acelerar o desenvolvimento mobile.
- **React Navigation:** Gestão de rotas e fluxo do usuário.
- **Axios:** Consumo de APIs REST.

### **Backend**
- **Node.js:** Ambiente de execução para o servidor.
- **Express:** Framework web rápido e minimalista.
- **MongoDB:** Banco de dados NoSQL focado em documentos e flexibilidade.
- **Mongoose:** ODM para modelagem de dados do MongoDB.
- **JWT (JSON Web Tokens):** Autenticação segura de usuários.

---

## Como rodar o projeto

Para rodar o FoodShare em sua máquina local, você precisará ter o **Node.js** e o **Git** instalados.

### 1. Clonando o repositório
```bash
git clone https://github.com/seu-usuario/foodshare.git
cd foodshare
```

### 2. Configurando o Backend
```bash
# Entre na pasta do servidor
cd backend

# Instale as dependências
npm install

# Crie um arquivo .env e configure sua string de conexão do MongoDB
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/foodshare

# Inicie o servidor
npm run dev
```

### 3. Configurando o Mobile
```bash
# Retorne à raiz e entre na pasta mobile
cd ../mobile

# Instale as dependências
npm install

# Inicie o Expo
npx expo start
```
Agora, basta escanear o QR Code gerado no terminal usando o app **Expo Go** (disponível na App Store ou Google Play).

---

## Roadmap e Próximas Funcionalidades
- [ ] Implementação de pagamentos online (Pix/Cartão).
- [ ] Sistema de avaliações para estabelecimentos.
- [ ] Chat em tempo real para dúvidas sobre retirada.
- [ ] Filtros avançados por restrições alimentares (Vegano, Sem Glúten).

---

## Contribuições

Contribuições são o que fazem a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1. Faça um Fork do projeto.
2. Crie uma Branch para sua Feature (`git checkout -b feature/NovaFeature`).
3. Comite suas mudanças (`git commit -m 'Add: Nova Feature'`).
4. Faça o Push para a Branch (`git push origin feature/NovaFeature`).
5. Abra um Pull Request.

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com por [Seu Nome/Empresa]. Juntos contra o desperdício!
