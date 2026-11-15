# Simulateur TCG – Frères Mario
Un seul `index.html` : double-clic en local, ou GitHub Pages (Settings → Pages → branche `main`, dossier `/`). Aucun serveur, aucun build.
Le projet utilise des scripts classiques (pas de modules ES, pas de `fetch`) pour fonctionner aussi en `file://`.
- `src/engine.js` : règles (état JSON + `E.act(état, action)`), indépendant de l'UI → base du multijoueur.
- `src/ai.js` : l'IA choisit des actions, comme le ferait un joueur distant.
- `data/cards.js` : toutes les cartes. `data/deck.js` : le deck (nombre d'exemplaires).
- `node tests/sim.mjs` : 100 parties IA vs IA pour vérifier le moteur.
Ajouter une carte : image dans `assets/cards/`, entrée dans `data/cards.js` (types `perso`, `action`, `equip`, `lieu`).
