# Quiz de Segurança da Informação
**Node.js + Express + MongoDB**

---

## Estrutura do projeto

```
quiz-seguranca/
├── public/
│   └── index.html          ← frontend (HTML/CSS/JS)
├── src/
│   ├── models/
│   │   └── Sessao.js       ← schema Mongoose (MongoDB)
│   ├── routes/
│   │   └── sessoes.js      ← rotas da API REST
│   ├── db.js               ← conexão com MongoDB
│   └── server.js           ← servidor Express
├── .env.example            ← modelo de variáveis de ambiente
├── .gitignore
└── package.json
```

---

## Instalação local (passo a passo)

### 1. Pré-requisitos
- Node.js v18 ou superior → https://nodejs.org
- MongoDB instalado localmente **ou** uma conta no MongoDB Atlas (gratuita)

### 2. Instalar dependências
```bash
cd quiz-seguranca
npm install
```

### 3. Configurar variáveis de ambiente
```bash
# Crie o arquivo .env copiando o exemplo
cp .env.example .env

# Edite o .env e cole sua connection string do MongoDB
# Exemplo local:
MONGODB_URI=mongodb://localhost:27017/quiz_seguranca
# Exemplo Atlas:
MONGODB_URI=mongodb+srv://SEU_USER:SUA_SENHA@cluster0.xxxxx.mongodb.net/quiz_seguranca
```

### 4. Rodar o servidor
```bash
# Produção
npm start

# Desenvolvimento (reinicia automaticamente ao salvar)
npm run dev
```

### 5. Acessar o quiz
Abra no navegador: **http://localhost:3000**

---

## Rotas da API

| Método | Rota                  | Descrição                          |
|--------|-----------------------|------------------------------------|
| POST   | /api/sessoes          | Salva resultado de uma sessão      |
| GET    | /api/sessoes/ultima   | Retorna o último registro salvo    |
| GET    | /api/sessoes          | Lista todas as sessões             |
| GET    | /api/sessoes/stats    | Estatísticas gerais                |

---

## Hospedagem em servidor — passo a passo

### Opção A: Railway (recomendado para iniciantes — gratuito)

1. Crie conta em https://railway.app
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Conecte seu repositório GitHub com o projeto
4. Clique em "Add Service" → "Database" → "MongoDB"
5. Vá em "Variables" e adicione:
   - `MONGODB_URI` → copie a connection string que o Railway gera automaticamente
   - `PORT` → deixe em branco (Railway define automaticamente)
6. Clique em "Deploy"
7. O Railway gera uma URL pública como `https://quiz-seguranca.up.railway.app`

### Opção B: Render (gratuito)

1. Crie conta em https://render.com
2. Clique em "New" → "Web Service"
3. Conecte o repositório GitHub
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Em "Environment Variables" adicione `MONGODB_URI` (use MongoDB Atlas)
6. Clique em "Create Web Service"

### Opção C: VPS próprio (DigitalOcean, Hostinger, etc.)

```bash
# 1. Conecte no servidor via SSH
ssh root@IP_DO_SERVIDOR

# 2. Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instale o PM2 (mantém o Node rodando em background)
npm install -g pm2

# 4. Clone o projeto
git clone https://github.com/SEU_USUARIO/quiz-seguranca.git
cd quiz-seguranca
npm install

# 5. Configure o .env
cp .env.example .env
nano .env   # cole sua MONGODB_URI

# 6. Inicie com PM2
pm2 start src/server.js --name "quiz-seguranca"
pm2 save
pm2 startup   # faz o app reiniciar automaticamente se o servidor reiniciar

# 7. Configure Nginx como proxy reverso (porta 80 → 3000)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/quiz

# Cole isso no arquivo:
# server {
#     listen 80;
#     server_name SEU_DOMINIO.com;
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

sudo ln -s /etc/nginx/sites-available/quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### MongoDB Atlas (banco em nuvem — gratuito até 512 MB)

1. Crie conta em https://cloud.mongodb.com
2. Clique em "Create" → escolha "M0 Free"
3. Escolha a região mais próxima (ex: São Paulo)
4. Em "Security" → "Database Access" → crie usuário e senha
5. Em "Security" → "Network Access" → adicione `0.0.0.0/0` (permite qualquer IP)
6. Clique em "Connect" → "Drivers" → copie a connection string
7. Substitua `<password>` pela sua senha no arquivo `.env`

---

## Variável API_BASE no frontend

No arquivo `public/index.html`, linha:
```javascript
const API_BASE = '/api';
```

- **Local ou Railway/Render:** mantenha `/api` (relativo — funciona automaticamente)
- **Se o backend estiver em outro domínio:**
```javascript
const API_BASE = 'https://sua-api.railway.app/api';
```
