import WebSocket from "ws";
import fetch from "node-fetch";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const ws = new WebSocket("wss://ws-1hb2.onrender.com");

ws.on("open", () => {
  console.log("✅ Conectado na WS");
});

ws.on("message", async (data) => {
  const msg = data.toString();

  if (msg.toLowerCase().includes("brainrot")) {
    await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `🧠 **Brainrot detectado!**\n${msg}`
      })
    });
  }
});
