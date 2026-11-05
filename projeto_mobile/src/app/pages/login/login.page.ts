import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle,
  IonCardContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle,
    IonCardContent, 
    IonItem, 
    IonInput, 
    IonButton, 
    IonSpinner
  ]
})
export class LoginPage implements OnInit {
  // Valores iniciais apenas para facilitar os testes com as credenciais simuladas.
  email: string = 'aluno@faculdade.edu.br';
  senha: string = '123456';
  // Controla o spinner e impede cliques repetidos enquanto a API responde.
  carregando: boolean = false;

  constructor(
    // Serviço que envia as credenciais e salva a sessão após o sucesso.
    private authService: AuthService,
    // Router navega entre páginas sem recarregar todo o aplicativo.
    private router: Router,
    // ToastController cria mensagens rápidas na parte inferior da tela.
    private toastCtrl: ToastController
  ) { }

  // Mantido para atender à interface OnInit; a tela não precisa de carga inicial extra.
  ngOnInit() { }

  // Navega para uma rota já cadastrada em app.routes.ts.
  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }

  // subscribe inicia a requisição HTTP retornada pelo Observable de login().
  executarLogin() {
    // A interface muda imediatamente para indicar que a requisição está em andamento.
    this.carregando = true;
    this.authService.login(this.email, this.senha).subscribe({
      next: async () => {
        // A API aceitou as credenciais e o AuthService armazenou os dados da sessão.
        this.carregando = false;
        const toast = await this.toastCtrl.create({ 
          message: 'Login realizado com sucesso!', 
          duration: 2000, 
          color: 'success' 
        });
        toast.present();
        // Só navegamos para a área interna após receber uma resposta de sucesso.
        this.router.navigate(['/tabs/inicio']);
      },
      error: async (err) => {
        // Erros HTTP, como 401, chegam neste callback.
        this.carregando = false;
        const toast = await this.toastCtrl.create({ 
          message: err.error?.erro || 'Credenciais inválidas!', 
          duration: 3000, 
          color: 'danger' 
        });
        toast.present();
      }
    });
  }
}