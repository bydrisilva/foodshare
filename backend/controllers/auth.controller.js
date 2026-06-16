const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função de Cadastro
exports.cadastro = async (req, res) => {
  try {
    const { nome, email, senha, telefone, cpf, tipo } = req.body;

    // Verifica se o usuário já existe pelo e-mail ou CPF
    const usuarioExistente = await User.findOne({ $or: [{ email }, { cpf }] });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'E-mail ou CPF já cadastrado.' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Cria o novo usuário
    const novoUsuario = new User({
      nome,
      email,
      senha: senhaCriptografada,
      telefone,
      cpf,
      tipo
    });

    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao cadastrar usuário.' });
  }
};

// Função de Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se o usuário existe
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    // Compara a senha fornecida com a senha criptografada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    // Gera o Token JWT
    // Certifique-se de ter uma chave secreta forte no seu .env: JWT_SECRET=sua_chave_secreta_aqui
    const secret = process.env.JWT_SECRET || 'chave_secreta_temporaria_mude_em_producao';
    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      secret,
      { expiresIn: '1d' } // O token expira em 1 dia
    );

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao realizar login.' });
  }
};

// Função para obter dados do usuário logado (GET /me)
exports.getMe = async (req, res) => {
  try {
    // O id do usuário vem do token verificado pelo middleware e é colocado no req.user
    const usuarioId = req.user.id;

    // Busca o usuário no banco de dados, excluindo a senha (-senha) do retorno por segurança
    const usuario = await User.findById(usuarioId).select('-senha');

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar dados do usuário.' });
  }
};

