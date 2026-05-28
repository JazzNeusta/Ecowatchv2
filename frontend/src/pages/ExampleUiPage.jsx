import {
  AlertMessage,
  Badge,
  Button,
  Card,
  Input,
  Loader,
  Select,
  Table,
} from "../ui";

function ExampleUiPage() {
  const columns = [
    { key: "device", label: "Boîtier" },
    { key: "type", label: "Type" },
    { key: "status", label: "Statut" },
  ];

  const rows = [
    { id: 1, device: "CT-001", type: "Climatrack", status: <Badge>Actif</Badge> },
    { id: 2, device: "AQ-002", type: "Aquacheck", status: <Badge variant="warning">Attention</Badge> },
  ];

  return (
    <main className="ew-page ew-stack">
      <h1>Composants UI Ecowatch</h1>

      <Card title="Carte d’information" subtitle="Bloc non cliquable pour les indicateurs et contenus dashboard.">
        <p>Les cartes reprennent le thème sombre de l’IHM avec un accent de couleur.</p>
      </Card>

      <div className="ew-grid">
        <Input label="Email" placeholder="utilisateur@email.fr" />
        <Select
          label="Type de boîtier"
          options={[
            { value: "climatrack", label: "Climatrack" },
            { value: "aquacheck", label: "Aquacheck" },
            { value: "greenwatch", label: "Greenwatch" },
          ]}
        />
      </div>

      <div className="ew-row">
        <Button>Valider</Button>
        <Button variant="secondary">Annuler</Button>
        <Button variant="outline">Exporter</Button>
        <Button variant="danger">Supprimer</Button>
      </div>

      <AlertMessage title="Information" variant="info">
        Ce composant peut être utilisé pour les messages de confirmation, d’erreur ou d’avertissement.
      </AlertMessage>

      <Table columns={columns} rows={rows} />

      <Loader label="Chargement des données" />
    </main>
  );
}

export default ExampleUiPage;
