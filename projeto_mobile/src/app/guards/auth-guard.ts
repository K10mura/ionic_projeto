import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Guard funcional CanActivateFn
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário possui um token válido no storage
  const autenticado = await authService.estaAutenticado();

  if (autenticado) {
    return true; // Permite o acesso à rota protegida
  }

  // Redireciona para o login caso não esteja autenticado
  router.navigate(['/login']);
  return false; // Bloqueia o acesso
};