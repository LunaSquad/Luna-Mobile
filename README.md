# Luna Mobile

Aplicativo mobile do projeto **Luna**, desenvolvido com React Native e Expo, com foco na personalização lúdica de atividades educacionais para crianças com TDAH utilizando Inteligência Artificial Generativa.

O aplicativo adapta conteúdos pedagógicos com base no hiperfoco do aluno, tornando o aprendizado mais visual, interativo e envolvente.

---

# Sobre o projeto

O Luna é um sistema educacional voltado para auxiliar crianças com TDAH no processo de aprendizagem através da adaptação de conteúdos escolares utilizando hiperfocos como ferramenta pedagógica.

A aplicação mobile é responsável por:

- Exibir matérias e atividades.
- Consumir planos adaptados por IA.
- Personalizar experiências com base no hiperfoco do aluno.
- Apresentar atividades gamificadas.
- Melhorar foco, engajamento e acessibilidade no aprendizado.

---

#  Funcionalidades

##  Aluno

- Login do usuário
- Visualização de matérias
- Acesso às atividades adaptadas
- Conteúdo personalizado conforme hiperfoco
- Interface gamificada
- Questões objetivas e discursivas
- Navegação entre atividades
- Feedback visual de respostas

---

##  Inteligência Artificial

- Adaptação automática de planos de aula
- Personalização baseada no hiperfoco do aluno
- Transformação do conteúdo pedagógico
- Geração de atividades contextualizadas

---

##  Interface

- Design lúdico e acessível
- Componentes gamificados
- Navegação intuitiva
- Indicadores visuais de progresso
- Sistema de páginas nas atividades

---

#  Tecnologias utilizadas

## Mobile

- React Native
- Expo
- TypeScript
- React Navigation

## Backend/API

- FastAPI
- Python

## Banco de Dados

- MongoDB

## Inteligência Artificial

- OpenAI API / IA Generativa

---

# 📂 Estrutura do projeto

```bash
src/
├── assets/
├── components/
│   ├── moldes/
│   │   ├── quizMolde/
│   │   └── fasesMolde/
│   └── ...
├── screens/
│   ├── home/
│   ├── activities/
│   ├── adaptedActivity/
│   └── ...
├── services/
├── routes/
└── styles/
```

---

#  Como executar o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/luna-mobile.git
```

---

## 2. Acesse a pasta

```bash
cd luna-mobile
```

---

## 3. Instale as dependências

```bash
npm install
```

ou

```bash
yarn
```

---

## 4. Configure a URL da API

No arquivo:

```bash
src/services/ip.ts
```

Configure a URL do backend:

```ts
const API_BASE_URL = "http://SEU_IP:8000";
```

---

## 5. Execute o projeto

```bash
npx expo start
```

---

# 📸 Telas do aplicativo

##  Explicação adaptada

- Exibição do plano adaptado pela IA
- Conteúdo contextualizado com hiperfoco
- Interface lúdica

---

##  Quiz interativo

- Questões objetivas
- Feedback visual
- Sistema gamificado

---

##  Atividades discursivas

- Resposta escrita
- Navegação por fases
- Correção de respostas

---

#  Integração com Backend

O aplicativo consome endpoints responsáveis por:

- Buscar dados do aluno
- Identificar hiperfoco
- Solicitar adaptação do plano
- Retornar atividades adaptadas

Exemplo:

```http
POST /ai/adaptar-plano
```

---

#  Objetivo acadêmico

O projeto foi desenvolvido como parte do Projeto Integrador do curso de Desenvolvimento de Software Multiplataforma da FATEC.

Tema:

> Personalização Lúdica de Planos de Aula para Crianças com TDAH com Ênfase no Hiperfoco

---

#  ODS Relacionados

O projeto está alinhado aos seguintes Objetivos de Desenvolvimento Sustentável da ONU:

- ODS 3 — Saúde e Bem-Estar
- ODS 4 — Educação de Qualidade

---

#  Desenvolvedores

Projeto desenvolvido por estudantes da FATEC.

---

#  Licença

Este projeto possui finalidade acadêmica.
