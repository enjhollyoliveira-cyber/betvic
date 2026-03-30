function girar() {
  const custo = 10;

  fetch(API + "/bet", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      user: usuario,
      valor: custo
    })
  })
  .then(r => r.json())
  .then(d => {
    if(d.erro){
      alert(d.erro);
      return;
    }

    document.getElementById("saldo").innerText = d.saldo;

    const simbolos = ["🍒","🍋","🍇","⭐","💎"];

    const s1 = simbolos[Math.floor(Math.random()*simbolos.length)];
    const s2 = simbolos[Math.floor(Math.random()*simbolos.length)];
    const s3 = simbolos[Math.floor(Math.random()*simbolos.length)];

    document.getElementById("slots").innerText = `${s1} ${s2} ${s3}`;

    if (s1 === s2 && s2 === s3) {
      document.getElementById("resultado").innerText = "🔥 JACKPOT!!!";
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      document.getElementById("resultado").innerText = "✨ Quase! Ganhou algo";
    } else {
      document.getElementById("resultado").innerText = "💀 Perdeu tudo";
    }
  });
}
