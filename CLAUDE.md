@.claude/CLAUDE-commun.md

# CLAUDE.md — Ecowatchv2

Refonte simplifiée d'Ecowatch : squelette front React + API Express, avec une bibliothèque de composants UI de base. Dépôt partagé avec : Damien, Aymeric.
Config du socle : `_dev/projet.json`. Règles communes : `.claude/CLAUDE-commun.md` (ne pas dupliquer ici).

## Stack

- Front : React 18 / Create React App (`frontend/`, port 3000) ; composants réutilisables dans `frontend/src/ui`.
- API : Node.js / Express (`backend/`, port 4000, routes sous `/api`), PostgreSQL via `pg` (`DATABASE_URL`).
- `docker-compose.yml` monte les deux services (le backend lit `backend/.env`).
- `frontend/build/` est généré par `npm --prefix frontend run build` : ne pas l'éditer.

## Commandes

```bash
npm ci && npm --prefix backend ci && npm --prefix frontend ci   # cf. commandes.installer
npm --prefix backend run dev     # API :4000   (cf. commandes.lancer.api)
npm --prefix frontend start      # front :3000 (cf. commandes.lancer.front)
npm --prefix frontend run build  # cf. commandes.construire
```

Pas de tests pour l'instant : `commandes.tester` = `null`.

## Gros risques du projet

En plus de `CLAUDE-commun.md` § 3 :
- ⛔ Requête SQL d'écriture sur la base pointée par `backend/.env` (`DATABASE_URL`).

## Pièges

- Ne contrôle la syntaxe que de `backend/` : le front est en JSX, que `node --check` ne parse pas (`code.syntaxe`).
- Copie `backend/.env.example` et `frontend/.env.example` pour lancer en local ; le front appelle l'API via `REACT_APP_API_URL`.
- Ne rajoute pas `.github/workflows/socle.yml` : le dépôt est public et ne peut pas appeler le workflow privé de socle-claude.
- La branche `main` ne contient pas le travail sur les mods : il vit sur `dev/mods`.
