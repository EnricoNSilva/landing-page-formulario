# 🚀 Landing Page - CASE 2025 (Frontend)

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Frontend desenvolvido para a ação promocional **"Radar de Produtividade + Uber"** durante o evento **CASE 2025**. O projeto consiste em uma Landing Page de alta conversão com design "Dark Tech", formulário multi-etapa e validação em tempo real.

## 📸 Preview

<img SRC="https://i.imgur.com/mTrnt06.png" alt="Preview da página"></img>

## 🎨 Design & UX

O projeto utiliza uma identidade visual moderna focada em alto contraste para eventos noturnos/tech:
* **Tema:** Dark Mode Profundo (`#09090b`).
* **Acento:** Neon Green (`#39ff14`) para Call-to-Actions (CTA).
* **Layout:** Split-screen responsivo (Copywriting à esquerda, Formulário à direita).

## ✨ Funcionalidades

* **Formulário Multi-etapa (Stepper):** Divide o cadastro em passos lógicos para reduzir fricção.
* **Validação Híbrida:**
    * *Visual:* Bordas vermelhas e mensagens de erro instantâneas no input.
    * *Lógica:* Pré-validação via API (verifica duplicidade de e-mail/telefone antes de avançar).
* **Feedback de Estado:** Botões com estado de "Verificando..." e feedback de carregamento.
* **Tela de Sucesso:** Feedback visual de confirmação sem uso de pop-ups intrusivos.
* **Campos Condicionais:** Exibe campos corporativos (Empresa/Cargo) apenas para perfis B2B.

## 🛠️ Tecnologias

* **Framework:** Angular 17+ (Standalone Components)
* **Estilização:** CSS3 Nativo (Variáveis CSS `:root`, Flexbox, Grid)
* **Http Client:** Integração REST com o Backend.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js (v18+)
* Angular CLI (`npm install -g @angular/cli`)

### Instalação

1. Clone o repositório:
   `git clone https://github.com/seu-usuario/landing-page-case.git`

2. Entre na pasta do projeto:
   `cd landing-page-case`

3. Instale as dependências:
   `npm install`

4. Inicie o servidor de desenvolvimento:
   `ng serve`

5. Acesse no navegador: `http://localhost:4200`

---
Desenvolvido por **Enrico** 💻
