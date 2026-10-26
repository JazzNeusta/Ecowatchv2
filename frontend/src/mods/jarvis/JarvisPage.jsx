import { useEffect, useState } from "react";
import { AlertMessage, Badge, Button, Card, Input } from "../../ui";
import { apiGet, apiPost } from "../../services/api";
import SentinelVerdict from "../SentinelVerdict";
import "./JarvisPage.css";

function JarvisPage() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    apiGet("/mods/jarvis/status").then(setStatus).catch(() => setStatus({ online: false }));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    const history = [...messages, { role: "user", content }];
    setMessages(history);
    setDraft("");
    setError(null);
    setIsSending(true);

    try {
      const answer = await apiPost("/mods/jarvis/chat", {
        messages: history.map(({ role, content: text }) => ({ role, content: text })),
      });
      setMessages([...history, { role: "assistant", content: answer.content, tools: answer.tools, sentinel: answer.sentinel }]);
    } catch (requestError) {
      setError({ message: requestError.message, sentinel: requestError.body?.sentinel });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="ew-page ew-stack">
      <div className="ew-row">
        <h1>JARVIS</h1>
        {status ? (
          <Badge variant={status.online ? "primary" : "danger"}>
            {status.online ? "En ligne" : "Hors ligne"}
          </Badge>
        ) : null}
      </div>

      {status && !status.online ? (
        <AlertMessage title="JARVIS est injoignable" variant="warning">
          Lance le service JARVIS (dépôt Neural-Crew/JARVIS, docker compose up) puis recharge la page.
        </AlertMessage>
      ) : null}

      <Card title="Conversation" subtitle="Chaque question et chaque réponse passent par Sentinel.">
        <div className="ew-chat">
          {messages.length === 0 ? (
            <p className="ew-chat__empty">Pose une question sur tes capteurs, par exemple : « Quelle est la température dans la serre ? »</p>
          ) : null}
          {messages.map((message, index) => (
            <div key={index} className={`ew-chat__message ew-chat__message--${message.role}`}>
              <p>{message.content}</p>
              {message.tools?.length ? (
                <small>Outils utilisés : {message.tools.map((tool) => tool.name).join(", ")}</small>
              ) : null}
              <SentinelVerdict sentinel={message.sentinel} />
            </div>
          ))}
        </div>
      </Card>

      {error ? (
        <AlertMessage title={error.message} variant="danger">
          {error.sentinel?.reasons?.join(" · ")}
        </AlertMessage>
      ) : null}

      <form className="ew-row ew-chat__form" onSubmit={handleSubmit}>
        <Input
          name="jarvis-question"
          label="Ta question"
          className="ew-chat__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Écris ta question…"
        />
        <Button type="submit" isLoading={isSending}>Envoyer</Button>
      </form>
    </main>
  );
}

export default JarvisPage;
