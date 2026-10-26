import { useEffect, useState } from "react";
import { AlertMessage, Button, Card, Input, Select } from "../../ui";
import { apiGet, apiPost } from "../../services/api";
import SentinelVerdict from "../SentinelVerdict";

const EMPTY_FORM = { plant: "", temperature: "", humidity: "", soilMoisture: "" };

function BioSensePage() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    apiGet("/mods/biosense/plants")
      .then(setPlants)
      .catch((requestError) => setError(requestError.message));
  }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      setResult(await apiPost("/mods/biosense/recommendations", form));
    } catch (requestError) {
      setResult(null);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="ew-page ew-stack">
      <h1>BioSense</h1>

      <Card title="Mesures" subtitle="Saisis les valeurs d'un capteur AquaCheck ou ClimaTrack.">
        <form className="ew-stack" onSubmit={handleSubmit}>
          <div className="ew-grid">
            <Select
              name="plant"
              label="Plante"
              value={form.plant}
              onChange={updateField}
              options={plants.map((plant) => ({ value: plant.id, label: plant.label }))}
              required
            />
            <Input name="temperature" label="Température (°C)" type="number" step="0.1" value={form.temperature} onChange={updateField} required />
            <Input name="humidity" label="Humidité de l'air (%)" type="number" step="1" min="0" max="100" value={form.humidity} onChange={updateField} required />
            <Input name="soilMoisture" label="Humidité du sol (%)" type="number" step="1" min="0" max="100" value={form.soilMoisture} onChange={updateField} helperText="Facultatif" />
          </div>
          <div className="ew-row">
            <Button type="submit" isLoading={isLoading}>Obtenir les recommandations</Button>
          </div>
        </form>
      </Card>

      {error ? <AlertMessage title="Erreur" variant="danger">{error}</AlertMessage> : null}

      {result ? (
        <Card
          title={`${result.plant.label} : humidex ${result.humidex} °C`}
          subtitle={result.level.label}
          accent={result.recommendations.some((item) => item.severity === "danger") ? "danger" : "primary"}
          footer={<SentinelVerdict sentinel={result.sentinel} />}
        >
          <div className="ew-stack">
            {result.recommendations.map((item, index) => (
              <AlertMessage key={index} variant={item.severity}>{item.message}</AlertMessage>
            ))}
          </div>
        </Card>
      ) : null}
    </main>
  );
}

export default BioSensePage;
