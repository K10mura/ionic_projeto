import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Converte a Promise do token em um Observable para clonar a requisição HTTP
  return from(authService.obterToken()).pipe(
    switchMap(token => {
      if (token) {
        // Clona a requisição adicionando o cabeçalho Authorization Bearer Token
        const requisicaoClonada = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(requisicaoClonada);
      }
      return next(req);
    })
  );
};