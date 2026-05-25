# 🌍 ComunAção

O **ComunAção** é uma plataforma web desenvolvida para conectar pessoas a eventos sociais e iniciativas comunitárias.  
O objetivo do projeto é facilitar a criação, divulgação e participação em ações como campanhas de doação, ajuda humanitária e eventos regionais, promovendo impacto social através da tecnologia.

A aplicação permite que usuários:
- Visualizem eventos em destaque
- Criem e gerenciem seus próprios eventos
- Participem de iniciativas comunitárias
- Acompanhem metas e objetivos dos eventos
- Encontrem oportunidades de voluntariado

O projeto foi construído com foco em usabilidade, organização visual e escalabilidade, seguindo um protótipo no Figma e aplicando boas práticas de desenvolvimento moderno.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- React (Vite)
- Tailwind CSS
- React Router DOM
- React Icons
- Axios

### ⚙️ Backend
- Node.js
- Express
- MongoDB
- Mongoose

### 🔐 Autenticação
- JSON Web Token (JWT)
- Context API (React)

### 🛠️ Ferramentas e Ambiente
- Visual Studio Code
- Postman (testes de API)
- Git & GitHub
- Figma (prototipação UI/UX)

---

## 📌 Status do Projeto

🚧 Em desenvolvimento  

Atualmente sendo implementadas:
- Interface completa baseada no protótipo
- CRUD de eventos
- Sistema de autenticação
- Integração com backend

---

## 🎯 Objetivo

Criar uma solução digital que incentive a participação social, facilite a organização de eventos comunitários e fortaleça a conexão entre pessoas que desejam gerar impacto positivo.

---

## 💡 Futuras melhorias

- Sistema de perfis de usuários
- Upload de imagens para eventos
- Sistema de participação (confirmar presença)
- Dashboard do usuário
- Notificações
- Filtros avançados de busca

---

## 👨‍💻 Autor

Desenvolvido por John Annyskier, Iago Jose Ramos e joão Ricardo Schmidt como parte de um projeto prático de desenvolvimento full stack.


1. Clonar o Projeto

Clone o repositório e acesse a pasta:

git clone https://github.com/IagoRamosH/communacao.git
cd comunacao

Se quiser usar a branch com alterações do backend:

git checkout backend-integracao-eventos
2. Configurar e Rodar o Backend

Entre na pasta do backend:

cd server

Instale as dependências:

npm install

Crie ou confira o arquivo .env com as seguintes variáveis:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/comunacao
JWT_SECRET=segredo_super_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

Inicie o backend:

npm start

O backend ficará disponível em:

http://localhost:5000

Para verificar se a API está funcionando:

http://localhost:5000/health

Resposta esperada:

{
  "status": "UP"
}
3. Configurar e Rodar o Frontend

Abra outro terminal, volte para a raiz do projeto e entre na pasta do frontend:

cd client
npm install
npm run dev

O frontend ficará disponível em:

http://localhost:5173

ou

http://127.0.0.1:5173
4. Observações Importantes

Para o projeto funcionar corretamente, mantenha dois terminais abertos simultaneamente:

Terminal 1 – Backend
cd server
npm start
Terminal 2 – Frontend
cd client
npm run dev
5. Integração
O frontend se comunica com o backend pela URL:
http://localhost:5000/api
O MongoDB local utiliza:
mongodb://127.0.0.1:27017/comunacao

O banco comunacao será criado automaticamente quando o primeiro dado for salvo.
