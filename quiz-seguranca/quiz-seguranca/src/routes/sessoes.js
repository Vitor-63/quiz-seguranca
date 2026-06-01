const express = require('express');
const router  = express.Router();
const Sessao  = require('../models/Sessao');

// ── POST /api/sessoes ─────────────────────────────────────
// Salva o resultado de uma sessão do quiz no MongoDB
router.post('/sessoes', async (req, res) => {
  try {
    const { acertos, erros, total_questoes, aproveitamento, nivel, detalhes } = req.body;

    // Validação básica
    if (acertos === undefined || total_questoes === undefined) {
      return res.status(400).json({ erro: 'Campos obrigatórios: acertos, total_questoes.' });
    }

    const sessao = await Sessao.create({
      acertos,
      erros,
      total_questoes,
      aproveitamento,
      nivel,
      detalhes: detalhes || []
    });

    return res.status(201).json({
      mensagem: 'Sessão salva com sucesso!',
      sessao
    });

  } catch (err) {
    console.error('[POST /sessoes]', err.message);
    return res.status(500).json({ erro: 'Erro interno ao salvar a sessão.' });
  }
});

// ── GET /api/sessoes/ultima ───────────────────────────────
// Retorna a última sessão registrada (substitui o localStorage.getItem)
router.get('/sessoes/ultima', async (req, res) => {
  try {
    const ultima = await Sessao.findOne().sort({ data_hora: -1 }).lean();

    if (!ultima) {
      return res.status(404).json({ mensagem: 'Nenhuma sessão encontrada.' });
    }

    return res.json(ultima);

  } catch (err) {
    console.error('[GET /sessoes/ultima]', err.message);
    return res.status(500).json({ erro: 'Erro interno ao buscar a sessão.' });
  }
});

// ── GET /api/sessoes ──────────────────────────────────────
// Lista todas as sessões (histórico completo)
router.get('/sessoes', async (req, res) => {
  try {
    const sessoes = await Sessao.find().sort({ data_hora: -1 }).lean();
    return res.json(sessoes);
  } catch (err) {
    console.error('[GET /sessoes]', err.message);
    return res.status(500).json({ erro: 'Erro interno ao listar sessões.' });
  }
});

// ── GET /api/sessoes/stats ────────────────────────────────
// Estatísticas gerais de todas as sessões
router.get('/sessoes/stats', async (req, res) => {
  try {
    const stats = await Sessao.aggregate([
      {
        $group: {
          _id: null,
          total_partidas:       { $sum: 1 },
          media_aproveitamento: { $avg: '$aproveitamento' },
          melhor_pontuacao:     { $max: '$acertos' },
          pior_pontuacao:       { $min: '$acertos' }
        }
      }
    ]);

    return res.json(stats[0] || {});
  } catch (err) {
    console.error('[GET /sessoes/stats]', err.message);
    return res.status(500).json({ erro: 'Erro interno ao calcular estatísticas.' });
  }
});

module.exports = router;
