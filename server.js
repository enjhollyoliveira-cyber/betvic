const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

const User = mongoose.model("User", {
  user: String,
  pass: String,
  saldo: Number,
  historico: Array
});

app.get("/", (req,res)=>{
  res.send("API BetVic com DB 🔥");
});

app.post("/register", async (req,res)=>{
  const { user, pass } = req.body;

  const existe = await User.findOne({ user });
  if(existe) return res.json({ erro: "Usuário existe" });

  await User.create({
    user,
    pass,
    saldo: 100,
    historico: []
  });

  res.json({ ok:true });
});

app.post("/login", async (req,res)=>{
  const { user, pass } = req.body;

  const u = await User.findOne({ user, pass });
  if(!u) return res.json({ erro:"Login inválido" });

  res.json({ saldo: u.saldo });
});

app.post("/bet", async (req,res)=>{
  const { user, valor } = req.body;

  const u = await User.findOne({ user });
  if(!u || valor > u.saldo){
    return res.json({ erro:"Saldo insuficiente" });
  }

  u.saldo -= valor;

  const win = Math.random() > 0.5;

  if(win){
    const ganho = valor * 2;
    u.saldo += ganho;
    u.historico.push("Ganhou " + ganho);
  } else {
    u.historico.push("Perdeu " + valor);
  }

  await u.save();

  res.json({ saldo: u.saldo });
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Servidor com DB 🚀");
});
