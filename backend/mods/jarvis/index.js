const express = require("express");
const { JARVIS_URL } = require("../../config/env");
const { createJarvisClient } = require("./client");

const manifest = {
  name: "jarvis",
  label: "JARVIS",
  description: "Chatbot de supervision environnementale, contrôlé par Sentinel.",
};

function create(context, { client = createJarvisClient({ baseUrl: JARVIS_URL }) } = {}) {
  const router = express.Router();

  router.get("/status", async (req, res) => {
    res.json(await client.status());
  });

  router.post("/chat", async (req, res) => {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const question = [...messages].reverse().find((message) => message.role === "user");
    if (!question) {
      return res.status(400).json({ error: "Aucun message utilisateur" });
    }

    const guard = context.guard();
    const inputCheck = guard.inspect({ source: "jarvis", direction: "input", text: question.content });
    if (inputCheck.verdict === "block") {
      return res.status(403).json({ error: "Question bloquée par Sentinel", sentinel: inputCheck });
    }

    let answer;
    try {
      answer = await client.chat(messages);
    } catch (error) {
      return res.status(502).json({ error: `JARVIS est injoignable : ${error.message}` });
    }

    const outputCheck = guard.inspect({ source: "jarvis", direction: "output", text: answer.content });
    if (outputCheck.verdict === "block") {
      return res.status(403).json({ error: "Réponse bloquée par Sentinel", sentinel: outputCheck });
    }

    res.json({ ...answer, sentinel: outputCheck });
  });

  return { router };
}

module.exports = { manifest, create };
