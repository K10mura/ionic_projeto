import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Observable representa um resultado que chegará no futuro.
// from() converte uma Promise em Observable para podermos usar operadores RxJS.
import { Observable, from } from 'rxjs';
// tap executa efeitos paralelos; catchError trata falhas; map transforma valores emitidos.
import { tap, catchError, map } from 'rxjs/operators';
import { StorageService } from './storage';

// Este contrato define a estrutura esperada para cada produto vindo da API e do cache.
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  // Endereço da API que fornece a lista atualizada de produtos.
  private apiUrl = 'http://localhost:3000/produtos';
  // Chave fixa usada para salvar e recuperar a mesma lista no armazenamento local.
  private CACHE_KEY = 'produtos_cache';

  constructor(
    // HttpClient realiza as requisições HTTP para o backend.
    private http: HttpClient,
    // StorageService grava e lê dados persistentes no dispositivo.
    private storage: StorageService
  ) { }

  // Requisição comum, sem fallback de cache.
  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  // Partial<Produto> permite enviar apenas os campos necessários ao cadastrar.
  criarProduto(produto: Partial<Produto>): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  // O id é acrescentado ao final da URL para excluir um produto específico.
  excluirProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // pipe() monta uma sequência de etapas para tratar a resposta da API.
  listarComCache(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      tap((produtos) => {
        // Salva uma cópia atualizada, sem modificar a lista que seguirá para a tela.
        // void deixa explícito que não aguardamos a Promise de gravação nesta etapa.
        void this.storage.salvar(this.CACHE_KEY, produtos);
      }),
      catchError(() => {
        // Se a requisição HTTP falhar, não encerramos o fluxo com erro.
        console.warn('Rede indisponível! Recuperando dados do cache local...');
        // obter() retorna Promise; from() a transforma em Observable compatível com RxJS.
        return from(this.storage.obter<Produto[]>(this.CACHE_KEY)).pipe(
          // Caso seja o primeiro acesso offline e não exista cache, exibe uma lista vazia.
          map((dadosLocais) => dadosLocais || [])
        );
      })
    );
  }
}