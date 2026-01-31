// ===============================
// Imports
// ===============================
import WebSocket from "ws";
import fetch from "node-fetch";
import http from "http";

// ===============================
// Variáveis do bot / WS
// ===============================
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const WS_URL = "wss://ws-1hb2.onrender.com";
const PORT = process.env.PORT || 3000;

// ===============================
// Mini servidor HTTP (obrigatório para Render)
// ===============================
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
}).listen(PORT, () => {
  console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

// ===============================
// Função principal WS
// ===============================
function connectWS() {
  console.log("🔄 Conectando na WS...");
  const ws = new WebSocket(WS_URL);

  let pingInterval;

  // Conexão aberta
  ws.on("open", () => {
    console.log("✅ Conectado na WS");

    // Ping a cada 20s pra manter viva
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
        console.log("📡 Ping enviado");
      }
    }, 20000);
  });

  // Recebendo mensagem da WS
  ws.on("message", async (data) => {
    const msg = data.toString();
    console.log("📩 WS:", msg);

    // Envia mensagem pro Discord
    if (true) { // TESTE: envia qualquer mensagem
      try {
        const res = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bot ${DISCORD_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: `🧠 Brainrot detectado!\n${msg}`
          })
        });

        const text = await res.text();
        console.log("📨 Discord status:", res.status, text);
      } catch (err) {
        console.error("❌ Erro enviando pro Discord:", err.message);
      }
    }
  });

  // WS fechou
  ws.on("close", () => {
    console.log("⚠️ WS desconectada. Reconectando em 5s...");
    clearInterval(pingInterval);
    setTimeout(connectWS, 5000);
  });

  // Erro WS
  ws.on("error", (err) => {
    console.error("❌ WS erro:", err.message);
  });
}

// ===============================
// Inicia a WS
// ===============================
connectWS();

// Mantém o app vivo no Render
setInterval(() => {}, 1000);
