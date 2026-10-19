# LOT 1 — Visée V2 et fiabilisation (0.5.0)

Version locale du 19 octobre 2026. Les modes historiques restent disponibles dans le sélecteur PROFIL. Aucun LOT 2 ou LOT 3 implémenté.

## Utilisation
- Lancer `node server.mjs` depuis ce dossier puis ouvrir http://127.0.0.1:4173/.
- Profil par défaut : carabine sportive à 10 m, cibles fixes, entraînement libre.
- Souris : déplacer la visée ; Espace ou clic : un départ ; V ou clic droit : épauler.
- Sensibilité, confort visuel ×30/×45/×60 et oscillations se règlent dans le menu. Échap pour ouvrir ce menu, puis reprendre la session.
- R : recharger. Le chargement de cinq plombs conserve le fonctionnement pédagogique du prototype ; ce n'est pas une interface de séries sportives.
- T : ramener le carton, T : renvoyer, puis T ou « Reprendre le tir » : retrouver le contrôle. Le tir est bloqué pendant toutes ces transitions.
- Flèches gauche/droite : choisir le carton à examiner.
- Modes historiques : les trois armes, 10/25/50 m, cibles mobiles et défi sont conservés.

## Ce que simule cette version
Carton 80 mm, noir 30,5 mm, anneau extérieur 45,5 mm, plomb visuel 4,5 mm. La distance longitudinale entre l'œil virtuel et le plan de cible vaut 10 m. Le grossissement de confort ne change aucune dimension physique. Le dioptre sportif en vue épaulée est une représentation angulaire à l'écran, alignée avec le rayon de tir ; ce n'est pas une simulation optique complète de l'œil.

Le score entier applique une convention pédagogique de contact entre le bord du plomb et le cordon. Les dimensions sont référencées ; le score n'est pas certifié comme lecture officielle de jauge papier. Voir docs/LOT1-REFERENCE.md.

Le taux « Dans les anneaux » est un taux de coups marquants. Il ne mesure pas la dispersion. Le journal des départs est conservé en mémoire pour le futur LOT 2 ; il n'y a ni analyse avancée de groupement, ni sauvegarde de séance.

## Vérifier
`node --test tests/rules.test.mjs tests/carrier.test.mjs tests/sport.test.mjs tests/integration.test.mjs`

Les tests d'intégration utilisent le moteur géométrique réel Three.js avec interface et renderer simulés. Les essais navigateur et les limites sont documentés dans le rapport de livraison. Le test tactile est simulé, pas réalisé sur téléphone physique.

---


## Historique des versions précédentes

# CJAJLK Precision — prototype 0.1

Stand de tir 3D autonome pour CJAJLK Games. Première version jouable, avec modèles géométriques provisoires et sons synthétisés. Le rendu n'est pas encore photoréaliste.

## Lancement local
Depuis ce dossier, lancer `node server.mjs`, puis ouvrir http://127.0.0.1:4173.
Node.js doit être disponible. Le serveur écoute uniquement sur cet ordinateur.
Ne pas ouvrir index.html directement : les modules JavaScript nécessitent un serveur HTTP.

## Jouer
- Souris : orienter la visée. Clic gauche ou Espace : tirer.
- Clic droit maintenu ou V : regarder à travers le viseur à point rouge. R : recharger.
- Touches 1, 2, 3 : changer d'arme. Échap : pause.
- Mobile : glisser sur le stand pour viser, boutons TIR et VISÉE.
- Entraînement libre ou défi de 60 secondes, cibles fixes ou mobiles.
- Distances 10, 25 et 50 mètres. Score de 1 à 10 par impact dans les anneaux.
- Le record des défis est conservé dans ce navigateur quand le stockage local est disponible.

## Intégration au site
Copier index.html, styles/, src/ et assets/ dans un sous-dossier du site existant, puis ajouter un lien vers ce sous-dossier. Les chemins sont relatifs. Aucun compte ni service distant requis au lancement.
Ne pas remplacer la page d'accueil de CJAJLK Games avec ce fichier.
Aucune publication ni modification du site existant effectuée dans ce lot.

## Vérification
`node --test tests/rules.test.mjs`

## Limites du prototype
Modèles des armes et stand créés en géométrie simple ; sons générés. Pas de simulation balistique physique, de déplacement libre ni de multijoueur. Contrôles tactiles implémentés, à valider sur un appareil réel.


## Visée de la carabine — version 0.3
La C-22 utilise désormais un dioptre mécanique : œilleton arrière, guidon annulaire avant et supports fins. Aucun point rouge ni verre teinté sur cette arme. Le grossissement de confort a été réduit et un léger mouvement de respiration ajouté. Clic droit maintenu ou V pour épauler. Le point rouge de la carabine est réservé à une future amélioration, non disponible dans cette version.
Validation : rendu du dioptre inspecté dans le navigateur ; tir sur cible donnant 9 points et consommant une cartouche. Tests des scores réussis.

## Ramène-cible — version 0.4
- T : ramener la cible sélectionnée, puis T à nouveau pour la renvoyer.
- Flèches gauche/droite : sélectionner le carton quand il est en position de tir ; un sélecteur et un bouton sont aussi disponibles sur écran tactile.
- Transport animé sur rail ; examen rapproché adapté à la largeur de l'écran.
- Arme abaissée, tir bloqué et chrono du défi suspendu pendant le transport et l'examen.
- Impacts conservés et nombre d'impacts/points affichés pour le carton examiné.
- Les petites bordures claires autour des impacts permettent de les lire dans le noir de la cible.
Tests : `node --test tests/rules.test.mjs tests/carrier.test.mjs` (4 tests réussis).

