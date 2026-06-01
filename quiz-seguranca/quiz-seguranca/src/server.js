require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const conectarDB = require('./db');
const sessoesRouter = require('./routes/sessoes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ───────────────────────────────────────────
app.use(cors());                          // permite requisições do frontend
app.use(express.json());                  // parse do body JSON
app.use(express.static(path.join(__dirname, '..', 'public'))); // serve o HTML

// ── Rotas da API ──────────────────────────────────────────
app.use('/api', sessoesRouter);

// ── Rota raiz — entrega o quiz ─────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── Inicialização ─────────────────────────────────────────
(async () => {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}/api/sessoes`);
  });
})();
