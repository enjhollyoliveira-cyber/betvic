const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let usuarios = {};

app.get("/", (req,res)=>{
  res.send("API BetVic rodando 🔥");
});

app.post("/register", (req, res) => {
  const { user, pass } = req.body;

  if (usuarios[user]) {
    return res.json({ erro: "Usuário já existe" });
  }

  usuarios[user] = {
    pass,
    saldo: 100,
    historico: []
  };

  res.json({ ok: true });
});

app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  const u = usuarios[user];

  if (!u || u.pass !== pass) {
    return res.json({ erro: "Login inválido" });
  }

  res.json({ ok: true, saldo: u.saldo });
});

app.post("/bet", (req, res) => {
  const { user, valor } = req.body;

  const u = usuarios[user];

  if (!u || valor > u.saldo) {
    return res.json({ erro: "Saldo insuficiente" });
  }

  u.saldo -= valor;

  const win = Math.random() > 0.5;

  if (win) {
    const ganho = valor * 2;
    u.saldo += ganho;
    u.historico.push(`Ganhou ${ganho}`);
  } else {
    u.historico.push(`Perdeu ${valor}`);
  }

  res.json({ saldo: u.saldo });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando 🚀");
});
