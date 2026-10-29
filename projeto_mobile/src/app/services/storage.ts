import { Injectable } from '@angular/core';
// API do Capacitor que acessa o armazenamento local do dispositivo.
import { Preferences } from '@capacitor/preferences';

@Injectable({
  // Permite injetar este serviço em qualquer página sem cadastrá-lo manualmente.
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // A chave identifica o valor salvo; use sempre o mesmo texto para recuperá-lo depois.
  // "any" permite salvar booleanos, textos, números, objetos e arrays neste exemplo.
  async salvar(chave: string, valor: any): Promise<void> {
    await Preferences.set({
      key: chave,
      // Preferences só armazena texto; JSON transforma outros tipos em texto.
      value: JSON.stringify(valor)
    });
  }

  // <T> é um tipo genérico: quem chama o método informa o tipo esperado na leitura.
  // Exemplo: obter<boolean>('modoEscuro') retorna Promise<boolean | null>.
  async obter<T>(chave: string): Promise<T | null> {
    // Desestruturação: pega apenas a propriedade "value" retornada pelo plugin.
    const { value } = await Preferences.get({ key: chave });
    // null significa que não existe nenhum valor salvo para esta chave.
    if (value === null) return null;

    try {
      // JSON.parse desfaz o JSON criado por JSON.stringify ao salvar o dado.
      // "as T" informa ao TypeScript qual tipo esperamos receber de volta.
      return JSON.parse(value) as T;
    } catch (erro) {
      // Um valor inválido no storage não pode ser convertido de JSON para o tipo esperado.
      console.error(`Não foi possível ler a preferência "${chave}".`, erro);
      return null;
    }
  }

  // Exclui apenas o dado associado à chave recebida.
  async remover(chave: string): Promise<void> {
    await Preferences.remove({ key: chave });
  }

  // Atenção: remove todas as preferências deste aplicativo, sem pedir confirmação.
  async limparTudo(): Promise<void> {
    await Preferences.clear();
  }
  // Adicionar dentro da classe StorageService:

// Cada pendência pode representar uma ação que será enviada ao servidor depois.
// Exemplo: { tipo: 'criar-produto', dados: novoProduto }.
async adicionarPendencia(item: any): Promise<void> {
  // Se a fila ainda não existir, começa com um array vazio.
  const pendencias = (await this.obter<any[]>('pendencias_offline')) || [];
  // push adiciona a nova ação ao final, preservando as pendências já armazenadas.
  pendencias.push(item);
  // Salva o array inteiro novamente porque o storage grava um valor por chave.
  await this.salvar('pendencias_offline', pendencias);
}

// Retorna uma lista pronta para percorrer, mesmo que não haja itens pendentes.
async obterPendencias(): Promise<any[]> {
  return (await this.obter<any[]>('pendencias_offline')) || [];
}

// Execute somente depois de confirmar que todas as ações foram sincronizadas.
async limparPendencias(): Promise<void> {
  await this.remover('pendencias_offline');
}
}