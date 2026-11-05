import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Observable representa a resposta HTTP; from() transforma uma Promise em Observable.
import { Observable, from } from 'rxjs';
// concatMap aguarda uma etapa assíncrona; map devolve a resposta original após essa etapa.
import { concatMap, map } from 'rxjs/operators';
import { StorageService } from './storage';

// Contrato TypeScript para a resposta bem-sucedida recebida de POST /login.
export interface RespostaLogin {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL do endpoint responsável por validar as credenciais.
  private apiUrl = 'http://localhost:3000/login';

  constructor(
    // HttpClient envia a requisição HTTP para a API.
    private http: HttpClient,
    // StorageService mantém token e dados do usuário mesmo após fechar o app.
    private storage: StorageService
  ) { }

  // Envia um objeto com email e senha no corpo da requisição POST.
  login(email: string, senha: string): Observable<RespostaLogin> {
    return this.http.post<RespostaLogin>(this.apiUrl, { email, senha }).pipe(
      // concatMap aguarda o salvamento antes de liberar a resposta para a página.
      concatMap((resposta) =>
        from(Promise.all([
          // A resposta só chega aqui quando a API retorna sucesso (HTTP 2xx).
          this.storage.salvar('token_jwt', resposta.token),
          // Também persistimos dados úteis para exibir o usuário logado nas próximas telas.
          this.storage.salvar('usuario_logado', resposta.usuario)
        ])).pipe(
          // Após salvar as duas chaves, devolvemos a resposta original ao subscribe().
          map(() => resposta)
        )
      )
    );
  }

  // Promise<string | null>: retorna null quando ainda não existe sessão salva.
  async obterToken(): Promise<string | null> {
    return await this.storage.obter<string>('token_jwt');
  }

  // !! converte o token (string ou null) em true ou false.
  // A validação da assinatura e expiração será aprofundada na próxima aula.
  async estaAutenticado(): Promise<boolean> {
    const token = await this.obterToken();
    return !!token;
  }

  // Logout remove as duas chaves para que o app não reutilize a sessão anterior.
  async logout(): Promise<void> {
    await this.storage.remover('token_jwt');
    await this.storage.remover('usuario_logado');
  }
}