# Simulateur TCG – Frères Mario
Site statique, sans build : fonctionne tel quel sur GitHub Pages (Settings → Pages → branche `main`, dossier `/`).
En local : `python -m http.server` puis http://localhost:8000 (les `fetch` JSON ne marchent pas en `file://`).
- `src/engine.js` : règles (état JSON + `act(état, action)`), aucune dépendance à l'UI → base du multijoueur.
- `src/ai.js` : l'IA ne fait que choisir des actions, comme le ferait un joueur distant.
- `data/cards.json` : toutes les cartes. `data/deck.json` : le deck (nombre d'exemplaires).
- `node tests/sim.mjs` : 100 parties IA vs IA pour vérifier le moteur.
Ajouter une carte : image dans `assets/cards/`, entrée dans `cards.json` (types `perso`, `action`, `equip`, `lieu`).
