# Backend ComunAcao

API Node.js/Express com MongoDB para autenticar usuarios, gerenciar eventos sociais, registrar participacoes e aprovar usuarios como organizacoes.

## Como rodar

1. Crie o arquivo `.env` em `server`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/comunacao
JWT_SECRET=troque_essa_chave
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

2. Instale dependencias e suba a API:

```bash
npm install
npm run dev
```

## Perfis

- `admin`: gerencia usuarios, eventos, aprova organizacoes e ve auditoria.
- `user`: nasce automaticamente no registro, cria 1 evento ativo por vez e participa de eventos.
- `organization`: aprovado por admin apos conseguir 5 filiadas em seus eventos, cria eventos ilimitados e gerencia filiadas/voluntarios.

## Endpoints principais

Use `Authorization: Bearer <token>` nas rotas protegidas.

### Auth

- `POST /api/auth/register`

```json
{ "name": "Maria", "email": "maria@email.com", "password": "123456" }
```

- `POST /api/auth/login`

```json
{ "email": "maria@email.com", "password": "123456" }
```

- `GET /api/auth/me`

### Eventos

- `GET /api/events`
- `GET /api/events/:id`
- `GET /api/events/my-events`
- `POST /api/events`

```json
{
  "title": "Mutirao de alimentos",
  "description": "Arrecadacao e entrega de cestas basicas.",
  "category": "Doacao",
  "location": "Centro comunitario",
  "date": "2026-06-15T14:00:00.000Z",
  "image": "https://exemplo.com/imagem.jpg"
}
```

- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/participate`

```json
{ "kind": "volunteer" }
```

- `GET /api/events/:id/volunteers`

### Admin

- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `PUT /api/admin/users/:id/approve-organization`
- `PUT /api/admin/users/:id/reject-organization`
- `GET /api/admin/events/:eventId/volunteers`
- `GET /api/admin/audit-logs`

### Usuario/organizacao

- `GET /api/users/me`
- `PUT /api/users/me`
- `DELETE /api/users/affiliates/:affiliateId`

## Axios

```js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
