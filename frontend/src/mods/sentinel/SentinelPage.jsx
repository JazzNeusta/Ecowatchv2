import { useCallback, useEffect, useState } from "react";
import { AlertMessage, Badge, Button, Card, Table } from "../../ui";
import { apiGet } from "../../services/api";

const VERDICT_BADGES = {
  allow: { variant: "primary", label: "Validé" },
  flag: { variant: "warning", label: "Signalé" },
  block: { variant: "danger", label: "Bloqué" },
};

const COLUMNS = [
  { key: "at", label: "Heure" },
  { key: "source", label: "IA" },
  { key: "direction", label: "Sens" },
  { key: "verdict", label: "Verdict" },
  { key: "details", label: "Détails" },
];

function SentinelPage() {
  const [stats, setStats] = useState(null);
  const [journal, setJournal] = useState([]);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [nextStats, nextJournal] = await Promise.all([
        apiGet("/mods/sentinel/stats"),
        apiGet("/mods/sentinel/journal?limit=100"),
      ]);
      setStats(nextStats);
      setJournal(nextJournal);
      setError(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rows = journal.map((entry) => {
    const badge = VERDICT_BADGES[entry.verdict];
    return {
      id: entry.id,
      at: new Date(entry.at).toLocaleTimeString("fr-FR"),
      source: entry.source,
      direction: entry.direction === "input" ? "Question" : "Réponse",
      verdict: <Badge variant={badge.variant}>{badge.label}</Badge>,
      details: entry.reasons.length > 0 ? entry.reasons.join(" · ") : entry.excerpt,
    };
  });

  return (
    <main className="ew-page ew-stack">
      <div className="ew-row">
        <h1>Sentinel</h1>
        <Button variant="outline" size="sm" onClick={refresh}>Actualiser</Button>
      </div>

      {error ? <AlertMessage title="Erreur" variant="danger">{error}</AlertMessage> : null}

      {stats ? (
        <div className="ew-grid">
          <Card title={String(stats.total)} subtitle="Contrôles" accent="secondary" />
          <Card title={String(stats.allow)} subtitle="Validés" />
          <Card title={String(stats.flag)} subtitle="Signalés" accent="warning" />
          <Card title={String(stats.block)} subtitle="Bloqués" accent="danger" />
        </div>
      ) : null}

      <Card title="Journal" subtitle="Les 100 derniers contrôles, du plus récent au plus ancien.">
        <Table columns={COLUMNS} rows={rows} emptyMessage="Aucun contrôle pour l'instant" />
      </Card>
    </main>
  );
}

export default SentinelPage;
