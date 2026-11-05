import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/inicio',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./pages/detalhes/detalhes.page').then( m => m.DetalhesPage),
    canActivate: [authGuard]
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then( m => m.TabsPage),
    canActivate: [authGuard], // Protege todas as rotas filhas do 'tabs'
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/produtos/produtos.page').then( m => m.ProdutosPage),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage),
    canActivate: [authGuard]
  }
];

const jwt = require('jsonwebtoken');

// Middleware de verificação de token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai a string do "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado: Token não fornecido!' });
  }

  jwt.verify(token, CHAVE_SECRETA, (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado!' });
    }
    req.usuario = usuario;
    next();
  });
}

// Endpoint protegido da API
app.get('/perfil-protegido', autenticarToken, (req, res) => {
  res.status(200).json({ mensagem: 'Dados confidenciais acessados!', usuario: req.usuario });
});