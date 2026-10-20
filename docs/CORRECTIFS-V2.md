# CJAJLK Précision 0.6.0 — Correctifs V2

## Changements

- Carabine sportive centrée à l'écran, sensibilité hors visée réduite, recentrage volontaire avec C ou le bouton RECENTRER. Aucun recentrage continu ni attraction automatique.
- Retour au viseur après rechargement lorsque le joueur était épaulé. Rayon du tir prélevé avant le recul, sans dispersion aléatoire en sport.
- Impacts de diamètre 4,5 mm, matériau mat indépendant de l'éclairage, bord réduit à 2,5 % du rayon. Les impacts ne participent pas aux collisions.
- Séances de 5, 20 et 40 plombs, cinq départs par carton, changement explicite de carton, blocage après la limite. Un impact sur une autre cible ne rapporte pas de points dans une séance centrale.
- Statistiques calculées sur les coordonnées du plan de cible : score, centre moyen, décentrage, distance maximale centre à centre. Les manqués mesurables sont inclus ; moins de deux positions ne produit pas de dispersion inventée.
- Résultats des cartons conservés et vingt séances maximum sauvegardées dans le navigateur. La sauvegarde des résultats ne reprend pas une séance interrompue. Historique consultable dans les réglages ; absence de synchronisation entre appareils.
- Coordonnées numérotées consultables à l'examen, sans agrandir ni couvrir les trous.
- Ramène-cible avec départ et freinage progressifs. Tir interdit pendant transport, examen et transition. Reprise explicite après renvoi.
- Commandes visibles sur PC et mobile ; zones de sécurité, portrait et paysage, boutons principaux d'au moins 44 px dans les formats contrôlés.
- Éclairage : 11 sources de stand au lieu de 33, plus le flash historique et l'éclairage ambiant. Ombres désactivées (aucune source ne projetait d'ombre). Rendu suspendu en pause. Pas de dépendance ajoutée.

## Vérifications automatisées

Commande : `node --test tests/*.test.mjs`.
25 tests réussis, aucun échec. Tests existants préservés ; nouvelles vérifications sur séances, sauvegarde, statistiques, recentrage et cible voisine. Syntaxe du module principal vérifiée.

Le banc navigateur `tests/browser-touch.html` exécute les événements tactiles synthétiques dans le vrai moteur WebGL. Formats : 390 × 844 et 844 × 390. La capture native du pointeur y est neutralisée car un événement synthétique n'est pas un contact matériel. Ce contrôle n'émule pas tout Android et ne remplace pas un téléphone physique.

Un premier scénario attendait un délai fixe trop court après renvoi ; son contrôle de reprise a échoué. Le bouton était encore désactivé pendant la transition, puis est devenu disponible. Le scénario attend désormais explicitement cette disponibilité. Aucun contournement des verrous du jeu n'a été ajouté.

## Limites et vérifications sur téléphone

Aucun téléphone physique testé. Vérifier sur le Samsung : glissement avec un doigt et tir avec l'autre, sortie/retour de l'application, rotation portrait/paysage, visibilité des boutons avec les barres du navigateur, son, sauvegarde après fermeture puis réouverture et échauffement sur plusieurs séances. La mémoire GPU et les FPS du téléphone ne sont pas mesurés ; la baisse du nombre de lumières n'est pas présentée comme un gain chiffré.

Les cartons précédents sont conservés comme coordonnées et résultats ; cette version ne propose pas leur relecture dans le stand 3D. L'entraînement libre ne sauvegarde pas toutes ses positions dans l'historique de séances. Les modes historiques restent disponibles.

## Fichiers

`index.html`, `styles/main.css`, `src/game/main.js`, `src/game/carrier.js`, nouveau `src/game/groups.js`, `tests/harness.mjs`, nouveaux `tests/groups.test.mjs` et `tests/browser-touch.html`, `package.json`, documentation et README.

## Git

Départ : branche main propre, commit 52882a32b8924f35c9ec0a7fa526298d8d0fa132, dépôt officiel https://github.com/cjajlk/CJAJLK-Precision. Sauvegarde de la version de départ effectuée hors dépôt avant les modifications. Aucun travail préexistant écrasé.

## Résultat final des essais navigateur — 20 octobre 2026

Validés : démarrage WebGL, commandes PC Espace/V/C/R, glissement tactile synthétique et tir, 40 départs sur huit cartons, verrouillage du 41e tir, sauvegarde de 40 positions, examen et statistiques, renvoi et reprise après transition, pause. Les 30 contrôles de tailles et non-superposition des cinq commandes principales passent sur 390 × 844 et 844 × 390. Le bouton recharger était trop petit en paysage : sa hauteur minimale a été corrigée à 48 px et les contrôles relancés avec succès. Aucun test physique Android revendiqué.
