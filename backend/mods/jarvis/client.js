// Client du service JARVIS (Neural-Crew/JARVIS).
// JARVIS répond à POST /chat en NDJSON : une ligne JSON par événement
// ({ type: "token", content } pour le texte, tool_start/tool_end/tool_error
// pour les outils). On attend la réponse complète pour que Sentinel puisse
// la contrôler avant qu'elle n'arrive à l'utilisateur.

function parseNdjson(body) {
  const answer = [];
  const tools = [];

  for (const line of body.split("\n")) {
    if (line.trim() === "") continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event.type === "token" && typeof event.content === "string") {
      answer.push(event.content);
    } else if (event.type === "tool_start" || event.type === "tool_error") {
      tools.push({ name: event.name, status: event.type === "tool_error" ? "error" : "ok" });
    }
  }

  return { content: answer.join(""), tools };
}

function createJarvisClient({ baseUrl, timeoutMs = 120000 }) {
  async function chat(messages) {
    const response = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      throw new Error(`JARVIS a répondu ${response.status}`);
    }
    return parseNdjson(await response.text());
  }

  async function status() {
    try {
      const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(3000) });
      return { online: response.ok, url: baseUrl };
    } catch {
      return { online: false, url: baseUrl };
    }
  }

  return { chat, status };
}

module.exports = { createJarvisClient, parseNdjson };
