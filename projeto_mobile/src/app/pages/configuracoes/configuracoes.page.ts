import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonToggle, 
  IonInput, 
  IonButton 
} from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonToggle, 
    IonInput, 
    IonButton
  ]
})
export class ConfiguracoesPage implements OnInit {
  // Variáveis ligadas aos campos HTML por meio do [(ngModel)].
  modoEscuro: boolean = false;
  emailSalvo: string = '';

  // O Angular entrega automaticamente a instância do StorageService no construtor.
  constructor(private storageService: StorageService) { }

  // ngOnInit é executado quando a página é criada.
  // await garante que os valores sejam lidos antes de atualizar os campos da tela.
  async ngOnInit() {
    // Se a chave ainda não existir, obter() devolve null e usamos false como padrão.
    this.modoEscuro = (await this.storageService.obter<boolean>('modoEscuro')) || false;
    // A mesma ideia: caso não exista e-mail salvo, o campo começa vazio.
    this.emailSalvo = (await this.storageService.obter<string>('emailLembrado')) || '';
  }

  // Salva cada preferência usando uma chave fixa, que será usada novamente na leitura.
  async salvarConfiguracoes() {
    await this.storageService.salvar('modoEscuro', this.modoEscuro);
    await this.storageService.salvar('emailLembrado', this.emailSalvo);
    // Por enquanto, a confirmação aparece no Console do navegador (F12).
    console.log('Preferências salvas com sucesso no dispositivo!');
  }
}