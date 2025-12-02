import { ApplicationConfig, Component, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, OnDestroy } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Interface para tipagem do formulário Lead
interface Lead {
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  empresa: string;
  cargo: string;
  perguntaChecagem: string;
  perguntaGeral: string;
  adesao: boolean;
  LGPD: boolean;
}

// Interface para resposta da API
interface ApiErrorResponse {
  erros?: string[];
  mensagem?: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class LandingPageComponent implements OnDestroy {
  
currentStep: number = 1;

// Objeto que guarda os dados do formulário
lead: Lead = {
  nome: '',
  email: '',
  telefone: '',
  perfil: '',
  empresa: '',
  cargo: '',
  perguntaChecagem: '',
  perguntaGeral: '',
  adesao: false,
  LGPD: false
};

// objeto para armazenar erros de campos
fieldErrors: Partial<Record<keyof Lead, string>> = {};

globalError: string = '';

formSuccess: boolean = false;

constructor(private http: HttpClient) {}

loadingStep1: boolean = false;

loadingStep2: boolean = false;

private destroy$ = new Subject<void>();

// Função para avançar para a próxima etapa
nextStep() {
  this.fieldErrors = {} ;
  let hasLocalError = false;
// Validações para campos vazios
  if (!this.lead.nome) { this.fieldErrors['nome'] = 'Nome é obrigatório'; hasLocalError = true; }
  if (!this.lead.perfil) { this.fieldErrors['perfil'] = 'Selecione um perfil'; hasLocalError = true; }
  if (!this.lead.email) { this.fieldErrors['email'] = 'E-mail é obrigatório'; hasLocalError = true; }
  if (!this.lead.telefone) { this.fieldErrors['telefone'] = 'Telefone é obrigatório'; hasLocalError = true; }

  // Condicionais
  const corporativos = ['Executivo', 'Empresário', 'Investidor'];
  if (corporativos.includes(this.lead.perfil)) {
      if (!this.lead.empresa) { this.fieldErrors['empresa'] = 'Empresa é obrigatória'; hasLocalError = true; }
      else if (this.lead.empresa.length < 3) { this.fieldErrors['empresa'] = 'Empresa deve ter pelo menos 3 caracteres'; hasLocalError = true; }
      
      if (!this.lead.cargo) { this.fieldErrors['cargo'] = 'Cargo é obrigatório'; hasLocalError = true; }
      else if (this.lead.cargo.length < 3) { this.fieldErrors['cargo'] = 'Cargo deve ter pelo menos 3 caracteres'; hasLocalError = true; }
  }
  

  // Decisão
  if (hasLocalError) return;

  this.loadingStep1 = true; // Ativa loading
  const urlValidacao = 'http://localhost:3000/leads/validar-etapa1';

  // Apenas os dados da etapa 1
    const payloadEtapa1 = {
        nome: this.lead.nome,
        email: this.lead.email,
        telefone: this.lead.telefone,
        perfil: this.lead.perfil,
        empresa: this.lead.empresa,
        cargo: this.lead.cargo
    };

  this.http.post(urlValidacao, payloadEtapa1).pipe(
        takeUntil(this.destroy$)
    ).subscribe({
        next: (response) => {
            // O email é novo e os dados estão ok.
            this.loadingStep1 = false;
            this.currentStep = 2; 
        },
        error: (error) => {
            // retornou 400 (ex: E-mail duplicado)
            this.loadingStep1 = false;
            this.fieldErrors = {};
            
            if (error.status === 400 && error.error && error.error.erros) {
                // Mapeia erros da API para campos específicos
                error.error.erros.forEach((mensagemErro: string) => {
                    const msg = mensagemErro.toLowerCase();
                    
                    if (msg.includes('nome')) {
                        this.fieldErrors['nome'] = mensagemErro;
                    } else if (msg.includes('e-mail') || msg.includes('email')) {
                        this.fieldErrors['email'] = mensagemErro;
                    } else if (msg.includes('telefone')) {
                        this.fieldErrors['telefone'] = mensagemErro;
                    } else if (msg.includes('perfil')) {
                        this.fieldErrors['perfil'] = mensagemErro;
                    } else if (msg.includes('empresa')) {
                        this.fieldErrors['empresa'] = mensagemErro;
                    } else if (msg.includes('cargo')) {
                        this.fieldErrors['cargo'] = mensagemErro;
                    }
                });
            } else {
                this.globalError = "Erro de conexão com o servidor. Tente novamente.";
            }
        }
    });
}

prevStep() {
    this.currentStep = 1;
}

enviarLead() {
    // Validação final do Passo 2
    this.fieldErrors = {};
    let hasLocalError = false;

    if (!this.lead.perguntaChecagem) { this.fieldErrors['perguntaChecagem'] = 'Resposta obrigatória'; hasLocalError = true; }
    else if (this.lead.perguntaChecagem.length < 3) { this.fieldErrors['perguntaChecagem'] = 'Resposta deve ter pelo menos 3 caracteres'; hasLocalError = true; }
    if (!this.lead.adesao) { this.fieldErrors['adesao'] = 'Você precisa aceitar os termos'; hasLocalError = true; }
    if (!this.lead.LGPD) { this.fieldErrors['LGPD'] = 'Autorização necessária'; hasLocalError = true; }

    if (hasLocalError) return;

    // Envio
    const url = 'http://localhost:3000/leads'; 
    this.globalError = ''; 
    this.loadingStep2 = true;

    this.http.post(url, this.lead).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.formSuccess = true;
        this.fieldErrors = {};
        this.globalError = '';
      },
      error: (error) => {
        this.loadingStep2 = false;
        this.fieldErrors = {};
        if (error.status === 400 && error.error && error.error.erros) {
          // Mapeia erros da API para campos específicos
          error.error.erros.forEach((mensagemErro: string) => {
            const msg = mensagemErro.toLowerCase();
            
            if (msg.includes('pergunta') || msg.includes('checagem')) {
              this.fieldErrors['perguntaChecagem'] = mensagemErro;
            } else if (msg.includes('adesão') || msg.includes('termo')) {
              this.fieldErrors['adesao'] = mensagemErro;
            } else if (msg.includes('lgpd') || msg.includes('autorizo')) {
              this.fieldErrors['LGPD'] = mensagemErro;
            } else if (msg.includes('nome')) {
              this.fieldErrors['nome'] = mensagemErro;
            } else if (msg.includes('e-mail') || msg.includes('email')) {
              this.fieldErrors['email'] = mensagemErro;
            } else if (msg.includes('telefone')) {
              this.fieldErrors['telefone'] = mensagemErro;
            } else if (msg.includes('perfil')) {
              this.fieldErrors['perfil'] = mensagemErro;
            } else if (msg.includes('empresa')) {
              this.fieldErrors['empresa'] = mensagemErro;
            } else if (msg.includes('cargo')) {
              this.fieldErrors['cargo'] = mensagemErro;
            } else {
              this.globalError = mensagemErro;
            }
          });
        } else {
          this.globalError = "Erro de conexão. Tente novamente.";
        }
      }
    });
  }

  resetToStart() {
      this.formSuccess = false;
      this.currentStep = 1;
      this.lead = { nome: '', email: '', telefone: '', perfil: '', empresa: '', cargo: '', perguntaChecagem: '', perguntaGeral: '', adesao: false, LGPD: false };
      this.fieldErrors = {};
  }

  // Bloqueia números em campos de texto
  filterOnlyLetters(field: string) {
    // Remove apenas números, mantendo letras, espaços e caracteres especiais
    (this.lead as any)[field] = (this.lead as any)[field].replace(/[0-9]/g, '');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}