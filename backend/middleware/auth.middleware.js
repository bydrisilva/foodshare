const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // O token geralmente é enviado no header de autorização (Bearer token)
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  // Remove a palavra 'Bearer ' e pega apenas o token
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token em branco.' });
  }

  try {
    // Verifica o token usando a chave secreta
    const secret = process.env.JWT_SECRET || 'chave_secreta_temporaria_mude_em_producao';
    const decoded = jwt.verify(token, secret);

    // Adiciona os dados do usuário decodificado (id e tipo) ao request para as próximas rotas usarem
    req.user = decoded;
    
    // Continua para o controller da rota
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
