const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Array mutável em memória simulando o banco de dados
let produtos = [
  { id: 1, nome: 'Smartphone Android', preco: 1500.00, categoria: 'Eletrônicos' },
  { id: 2, nome: 'Fone de Ouvido Bluetooth', preco: 250.00, categoria: 'Acessórios' },
  { id: 3, nome: 'Carregador Rápido USB-C', preco: 120.00, categoria: 'Acessórios' }
];

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/produtos', (_req, res) => res.status(200).json(produtos));

// Rota POST /produtos (Criar)
app.post('/produtos', (req, res) => {
  const { nome, preco, categoria } = req.body;
  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios!' });
  }
  const novo = { id: Date.now(), nome, preco: Number(preco), categoria: categoria || 'Geral' };
  produtos.push(novo);
  res.status(201).json(novo);
});

// Rota DELETE /produtos/:id (Remover)
app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produtoExiste = produtos.some(p => p.id === id);
  if (!produtoExiste) {
    return res.status(404).json({ erro: 'Produto não encontrado!' });
  }
  produtos = produtos.filter(p => p.id !== id);
  res.status(200).json({ mensagem: 'Produto removido com sucesso!' });
});

module.exports = app;