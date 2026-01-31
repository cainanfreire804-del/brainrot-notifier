import WebSocket from "ws";
import fetch from "node-fetch";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

if (!DISCORD_TOKEN || !CHANNEL_ID) {
  console.error("❌ Variáveis de ambiente não configuradas");
  process.exit(1);
}

const WS_URL = "wss://ws-1hb2.onrender.com";

function connectWS() {
  console.log("🔄 Tentando conectar na WS...");

  const ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("✅ Conectado na WS");
  });

  ws.on("message", async (data) => {
    console.log("📩 Mensagem recebida:", data.toString());

    if (data.toString().toLowerCase().includes("brainrot")) {
      await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${DISCORD_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: "🧠 Brainrot detectado!"
        })
      });
    }
  });

  ws.on("close", () => {
    console.log("⚠️ WS desconectada. Tentando reconectar em 5s...");
    setTimeout(connectWS, 5000);
  });

  ws.on("error", (err) => {
    console.error("❌ Erro WS:", err.message);
  });
}

// 🔒 Mantém o processo vivo
setInterval(() => {}, 1000);

connectWS();
