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
  console.log("🔄 Conectando na WS...");
  const ws = new WebSocket(WS_URL);

  let pingInterval;

  ws.on("open", () => {
    console.log("✅ Conectado na WS");

    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
        console.log("📡 Ping enviado");
      }
    }, 20000);
  });

  ws.on("message", async (data) => {
    const msg = data.toString();
    console.log("📩 WS:", msg);

    if (msg.toLowerCase().includes("brainrot")) {
      await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${DISCORD_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: `🧠 Brainrot detectado!\n${msg}`
        })
      });
    }
  });

  ws.on("close", () => {
    console.log("⚠️ WS desconectada. Reconectando em 5s...");
    clearInterval(pingInterval);
    setTimeout(connectWS, 5000);
  });

  ws.on("error", (err) => {
    console.error("❌ WS erro:", err.message);
  });
}
// 🔒 Mantém o processo vivo
connectWS();
setInterval(() => {}, 1000);
