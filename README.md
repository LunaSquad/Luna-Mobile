# Luna Mobile

Aplicativo mobile do projeto **Luna**, desenvolvido com React Native e Expo, com foco na personalização lúdica de atividades educacionais para crianças com TDAH utilizando Inteligência Artificial Generativa.

O aplicativo adapta conteúdos pedagógicos com base no hiperfoco do aluno, tornando o aprendizado mais visual, interativo e envolvente.

---

# 🚀 Sobre o projeto

O Luna é um sistema educacional voltado para auxiliar crianças com TDAH no processo de aprendizagem através da adaptação de conteúdos escolares utilizando hiperfocos como ferramenta pedagógica.

A aplicação mobile é responsável por:

- Exibir matérias e atividades.
- Consumir planos adaptados por IA.
- Personalizar experiências com base no hiperfoco do aluno.
- Apresentar atividades gamificadas.
- Melhorar foco, engajamento e acessibilidade no aprendizado.

---

# 💡 Funcionalidades

## 🧑‍🎓 Aluno

- Login do usuário
- Visualização de matérias
- Acesso às atividades adaptadas
- Conteúdo personalizado conforme hiperfoco
- Interface gamificada
- Questões objetivas e discursivas
- Navegação entre atividades
- Feedback visual de respostas

---

## 🤖 Inteligência Artificial

- Adaptação automática de planos de aula
- Personalização baseada no hiperfoco do aluno
- Transformação do conteúdo pedagógico
- Geração de atividades contextualizadas

---

## 🎨 Interface

- Design lúdico e acessível
- Componentes gamificados
- Navegação intuitiva
- Indicadores visuais de progresso
- Sistema de páginas nas atividades

---

# 🛠️ Tecnologias utilizadas

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

## 🤖 Inteligência Artificial

O projeto utiliza uma arquitetura combinada de IA Generativa e Machine Learning clássico para entregar uma experiência totalmente personalizada:

- **Adaptação Textual (Gemini API):** Transformação do conteúdo pedagógico, roteiros e personalização dos planos de aula utilizando a API oficial do Google Gemini.
- **Seleção de Moldes (Scikit-Learn):** Modelo de *Machine Learning* clássico desenvolvido em Python, utilizando vetorização de texto (TF-IDF) e um classificador para definir automaticamente qual o melhor formato/molde de atividade para cada contexto.
- **Geração Visual e Figurinhas (Pollinations.ai + rembg):** Criação dinâmica de *assets* visuais focados no hiperfoco do aluno (gerando mascotes e itens temáticos) através da API do Pollinations.ai, combinada com a biblioteca `rembg` para remover o fundo automaticamente e aplicar as imagens de forma limpa na interface.

---

# ⚙️ Como executar o projeto (Passo a Passo)

Preparamos o projeto de forma que avaliadores e utilizadores possam testá-lo rapidamente, sem necessidade de configurações complexas. 

> **⚠️ Nota sobre Variáveis de Ambiente e Chaves de API:**
> Para facilitar a apresentação e testes práticos do projeto (como por professores e bancas avaliadoras), nós **disponibilizamos intencionalmente as credenciais do banco de dados (MongoDB), Cloudinary e Gemini** no ficheiro de configuração padrão e `.env`. 
> 
> Estas chaves estão associadas a contas gratuitas/de desenvolvimento criadas **exclusivamente para a apresentação deste projeto académico** e não contêm dados sensíveis ou informações em produção real. Estão aí para garantir que o sistema de Inteligência Artificial funcione imediatamente na vossa máquina!

## 1. Clone o repositório

```bash
git clone https://github.com/LunaSquad/Luna-Mobile.git
```

## 2. Aceda à pasta do projeto

```bash
cd Luna-Mobile
```

## 3. Preparar o Backend (Acesso e Configuração)
Se o backend não estiver na mesma pasta raiz, certifique-se de que tem a pasta `backend/` dentro do diretório principal.
Verifique o ficheiro `.env` dentro do backend. O projeto já tem *fallbacks* (valores de fallback configurados no `config.py`) para utilizar as nossas contas de teste se não existirem variáveis de ambiente configuradas, garantindo que a IA e o banco de dados funcionam \`out-of-the-box\`.

## 4. Instalar todas as dependências (Frontend + Backend)

O nosso ficheiro `package.json` possui um comando unificado que instala automaticamente as bibliotecas do React Native e também cria o ambiente virtual Python (`venv`) e instala as dependências do FastAPI. Basta executar:

```bash
npm run setup
```
*(Certifique-se de que tem o Python (>= 3.10 e < 3.15) instalado em sua máquina).*

## 5. Iniciar o projeto (FastAPI + Expo)

Não precisa de abrir duas abas do terminal. Temos um comando unificado que deteta o seu IP, inicia o servidor FastAPI (Backend) e logo a seguir o Expo (Frontend) no mesmo ambiente.

```bash
npm run dev
```

*O comando `start` vai abrir uma nova janela (no Windows) para o servidor backend e deixar o seu terminal principal livre para o Expo. Use a app **Expo Go** no seu telemóvel e leia o QR Code gerado no terminal para testar.*

---

# 🎓 Objetivo acadêmico

O projeto foi desenvolvido como parte do **Projeto Integrador** do curso de Desenvolvimento de Software Multiplataforma da FATEC Registro.

Tema:
> **Personalização Lúdica de Planos de Aula para Crianças com TDAH com Ênfase no Hiperfoco**

---

# 🌍 ODS Relacionados

O projeto está alinhado aos seguintes Objetivos de Desenvolvimento Sustentável da ONU:

- ODS 3 — Saúde e Bem-Estar
- ODS 4 — Educação de Qualidade

---

# 👨‍💻 Desenvolvedores

Projeto desenvolvido por estudantes da FATEC Registro:
- Vitor Gabriel Mandira Soares
- Miguel Santos Pereira
- geovanna Pereira da Silva
- Vinicius Freitas Leandro da silva
- Ana Flávia Cardozo Ribeiro

---

# 📄 Licença

Este projeto possui finalidade acadêmica e de avaliação.
