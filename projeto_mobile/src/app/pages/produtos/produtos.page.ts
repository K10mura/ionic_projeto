import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonBadge, 
  IonButton, 
  IonSpinner,
  IonRefresher, 
  IonRefresherContent 
} from '@ionic/angular/standalone';
import { ToastController, AlertController } from '@ionic/angular/standalone';
import { Produto, ProdutoService } from 'src/app/services/produto';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    // Necessário para o pipe currency usado no HTML para formatar o preço.
    CurrencyPipe,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonBadge, 
    IonButton, 
    IonSpinner,
    IonRefresher, 
    IonRefresherContent
  ]
})
export class ProdutosPage implements OnInit {
  // A lista começa vazia e é preenchida pela API ou pelo cache local.
  produtos: Produto[] = [];
  // Mantém o spinner visível durante a primeira busca ou uma atualização manual.
  carregando: boolean = true;

  constructor(
    // Serviço que busca produtos e aplica a estratégia de cache.
    private produtoService: ProdutoService,
    // Controladores do Ionic usados para mostrar mensagens e confirmações.
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  // ngOnInit é chamado quando a página é criada; aqui iniciamos a primeira carga.
  ngOnInit() {
    this.carregarProdutos();
  }

  // event é opcional: ele existe quando o usuário puxa a tela para atualizar.
  carregarProdutos(event?: any) {
    // Ativa o spinner antes de iniciar uma nova busca.
    this.carregando = true;
    this.produtoService.listarComCache().subscribe({
      next: (dados) => {
        // "dados" pode vir da API ou do cache, mas sempre tem o formato Produto[].
        this.produtos = dados;
        // A resposta chegou da API ou do cache; não é mais necessário exibir o spinner.
        this.carregando = false;
        // complete() encerra a animação do refresher, quando ela foi acionada.
        if (event) event.target.complete();
      },
      error: async () => {
        // Este caso cobre uma falha que não conseguiu ser resolvida pelo cache.
        this.carregando = false;
        if (event) event.target.complete();
        const toast = await this.toastCtrl.create({
          message: 'Não foi possível carregar os produtos salvos.',
          duration: 3000,
          color: 'warning'
        });
        toast.present();
      }
    });
  }

  // Exibe uma confirmação antes de executar uma ação que não pode ser desfeita.
  async confirmarExclusao(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: 'Deseja realmente remover este produto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          // handler só é chamado se o usuário confirmar a exclusão.
          handler: () => this.remover(id)
        }
      ]
    });
    await alert.present();
  }

  // Após excluir no servidor, recarregamos a lista para refletir a alteração na tela.
  remover(id: number) {
    this.produtoService.excluirProduto(id).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({ 
          message: 'Produto excluído com sucesso!', 
          duration: 2000, 
          color: 'success' 
        });
        toast.present();
        this.carregarProdutos();
      },
      error: async (erro) => {
        // Registra o detalhe técnico para depuração e informa a falha ao usuário.
        console.error('Não foi possível excluir o produto:', erro);
        const toast = await this.toastCtrl.create({
          message: 'Não foi possível excluir o produto. Tente novamente.',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}