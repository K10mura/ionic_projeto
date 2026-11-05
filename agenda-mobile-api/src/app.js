// Biblioteca que cria e verifica tokens JWT no servidor.
const jwt = require('jsonwebtoken');

// Esta chave assina o token: somente o servidor deve conhecê-la.
// Em um projeto real, guarde-a em uma variável de ambiente, nunca no código versionado.
const CHAVE_SECRETA = 'minha_chave_secreta_faculdade_2026';

// POST recebe dados no corpo da requisição; neste caso, e-mail e senha do formulário.
app.post('/login', (req, res) => {
  // Desestruturação: extrai as propriedades enviadas em req.body.
  const { email, senha } = req.body;

  // Credenciais fixas apenas para a demonstração. Em produção, consulte o banco de dados
  // e compare a senha usando hash (por exemplo, bcrypt).
  if (email === 'aluno@faculdade.edu.br' && senha === '123456') {
    // O payload contém dados de identificação. Nunca coloque a senha dentro do token.
    const token = jwt.sign(
      // sub (subject) identifica o usuário dono deste token.
      { sub: 1, email: email, nome: 'Aluno Exemplo' },
      CHAVE_SECRETA,
      // Após duas horas, o token expira e uma nova autenticação será necessária.
      { expiresIn: '2h' }
    );

    // 200 significa que o login foi processado com sucesso.
    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      usuario: { id: 1, nome: 'Aluno Exemplo', email: email }
    });
  }

  // 401 informa que o cliente não apresentou credenciais válidas.
  return res.status(401).json({ erro: 'Credenciais inválidas!' });
});