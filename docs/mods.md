# Mods Ecowatch

Un mod est une fonctionnalité qu'on active ou coupe sans toucher au reste de l'application.

| Mod | Rôle | Backend | Frontend |
|---|---|---|---|
| `sentinel` | L'IA qui contrôle les IA : vérifie chaque question et chaque réponse, bloque ou signale, tient un journal | `backend/mods/sentinel` | `frontend/src/mods/sentinel` |
| `biosense` | Recommandations pour les plantes à partir de l'humidex, de l'humidité et du sol | `backend/mods/biosense` | `frontend/src/mods/biosense` |
| `jarvis` | Chatbot, relais vers le service JARVIS (dépôt `Neural-Crew/JARVIS`) | `backend/mods/jarvis` | `frontend/src/mods/jarvis` |

## Activer ou couper un mod

Dans `backend/.env` :

```env
ENABLED_MODS=sentinel,biosense,jarvis
JARVIS_URL=http://localhost:8000
```

Le menu du frontend n'affiche que les mods activés (il les lit sur `GET /api/mods`).
Sans `sentinel`, les autres mods fonctionnent mais rien n'est contrôlé.

## Routes

| Route | Description |
|---|---|
| `GET /api/mods` | Mods actifs |
| `GET /api/mods/sentinel/journal?limit=50` | Derniers contrôles |
| `GET /api/mods/sentinel/stats` | Nombre de contrôles validés, signalés, bloqués |
| `POST /api/mods/sentinel/inspect` | Tester Sentinel sur un texte : `{ direction: "input" \| "output", text, facts? }` |
| `GET /api/mods/biosense/plants` | Catalogue des plantes |
| `POST /api/mods/biosense/recommendations` | `{ plant, temperature, humidity, soilMoisture? }` |
| `GET /api/mods/jarvis/status` | JARVIS joignable ou non |
| `POST /api/mods/jarvis/chat` | `{ messages: [{ role, content }] }` |

## Ce que contrôle Sentinel

- **Questions** : tentative de détournement des instructions (« ignore les instructions précédentes », « system prompt »…), message trop long. Bloqué.
- **Réponses** : clé d'API, mot de passe ou URL de base de données. Bloqué.
- **Réponses** : valeur en °C ou en % qui ne correspond à aucune mesure fournie. Signalé.
- **Réponses** vides. Signalé.

Le journal est gardé en mémoire (500 entrées) et repart à zéro au redémarrage du backend.

## Ajouter un mod

1. Créer `backend/mods/<nom>/index.js` qui exporte `manifest` (`name`, `label`, `description`) et `create(context)`, qui renvoie `{ router }`.
   Pour faire contrôler une IA : `context.guard().inspect({ source, direction, text, facts })`.
2. L'ajouter dans `AVAILABLE_MODS` (`backend/mods/index.js`).
3. Créer sa page dans `frontend/src/mods/<nom>/` et l'ajouter dans `frontend/src/mods/registry.js`.
4. L'ajouter dans `ENABLED_MODS`.

## Tests

```bash
cd backend && npm test
```

## À reprendre

- Le catalogue des plantes de BioSense (`backend/mods/biosense/plants.json`) est un point de départ à remplacer par le travail de l'équipe BioSense360.
- Les règles de Sentinel sont simples (expressions régulières), à enrichir avec le travail de l'équipe Sentinel360.
