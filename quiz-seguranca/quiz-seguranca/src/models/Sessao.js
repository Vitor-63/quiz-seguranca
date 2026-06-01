const mongoose = require('mongoose');

// Schema de cada questão respondida
const detalheSchema = new mongoose.Schema({
  questao:   { type: Number, required: true },
  categoria: { type: String, required: true },
  correta:   { type: Boolean, required: true }
}, { _id: false });

// Schema principal — espelha exatamente o objeto salvo antes no localStorage
const sessaoSchema = new mongoose.Schema({
  data_hora:      { type: Date,   default: Date.now },
  acertos:        { type: Number, required: true, min: 0 },
  erros:          { type: Number, required: true, min: 0 },
  total_questoes: { type: Number, required: true },
  aproveitamento: { type: Number, required: true, min: 0, max: 100 },
  nivel: {
    type: String,
    enum: ['iniciante', 'intermediário', 'avançado'],
    required: true
  },
  detalhes: [detalheSchema]
}, {
  timestamps: true,   // cria createdAt e updatedAt automaticamente
  collection: 'sessoes'
});

module.exports = mongoose.model('Sessao', sessaoSchema);
