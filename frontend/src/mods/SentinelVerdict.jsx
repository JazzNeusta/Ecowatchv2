import { Badge } from "../ui";

const VERDICTS = {
  allow: { variant: "primary", label: "Validé par Sentinel" },
  flag: { variant: "warning", label: "Signalé par Sentinel" },
  block: { variant: "danger", label: "Bloqué par Sentinel" },
};

// Affiche le verdict de Sentinel sur une réponse d'IA, avec ses raisons.
function SentinelVerdict({ sentinel }) {
  if (!sentinel) return null;
  const verdict = VERDICTS[sentinel.verdict] || VERDICTS.allow;
  const reasons = sentinel.reasons || [];

  return (
    <div className="ew-sentinel-verdict">
      <Badge variant={verdict.variant}>{verdict.label}</Badge>
      {reasons.length > 0 ? <small>{reasons.join(" · ")}</small> : null}
    </div>
  );
}

export default SentinelVerdict;
