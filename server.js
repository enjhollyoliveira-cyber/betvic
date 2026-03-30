require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB da BetVic!"))
  .catch(err => console.log("❌ Erro ao conectar:", err));

const userSchema = new mongoose.Schema({
  nome: String,
  saldo: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

app.post('/criar-usuario', async (req, res) => {
  const { nome } = req.body;
  const novo = new User({ nome });
  await novo.save();
  res.send({ msg: "Usuário criado!", id: novo._id });
});

app.post('/depositar', async (req, res) => {
  const { userId, valor } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.send("Usuário não encontrado!");
  user.saldo += valor;
  await user.save();
  console.log(`💰 Depósito de R$${valor} por ${user.nome}`);
  res.send(`Depósito de R$${valor} realizado! Saldo atual: R$${user.saldo}`);
});

app.post('/sacar', async (req, res) => {
  const { userId, valor } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.send("Usuário não encontrado!");
  if (user.saldo < valor) return res.send("Saldo insuficiente!");
  user.saldo -= valor;
  await user.save();
  res.send(`Saque de R$${valor} realizado! Saldo atual: R$${user.saldo}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor BetVic rodando na porta ${PORT}`));
