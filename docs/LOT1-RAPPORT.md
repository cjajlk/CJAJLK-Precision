# CJAJLK Précision — Livraison LOT 1 : Visée V2 et fiabilisation

Date : 19 octobre 2026. Version : 0.5.0. État : implémenté et testé, en attente de validation utilisateur.

## Résultat

Le projet existant a été conservé. Three.js r180, le stand, les trois armes historiques, leurs distances, les cibles mobiles, le défi, les sons, les impacts et le ramène-cible restent présents. Le menu propose désormais un profil distinct « Carabine sportive · 10 m · Libre ».

Aucun framework ou paquet ajouté, aucun commit, push ou déploiement. Les LOTS 2 et 3 ne sont pas commencés. Le journal minimal des tirs prépare le lot 2, sans interface de séries ni analyse de dispersion.

Projet jouable : `E:\cj_project\CJAJLK-Precision`.
Adresse locale : http://127.0.0.1:4173/ (serveur local déjà démarré pendant la livraison).
Pour relancer : ouvrir ce dossier, lancer `node server.mjs`, puis ouvrir cette adresse.

## 1. Sauvegarde et provenance

L'archive auditée `E:\cj_project\CJAJLK-Precision.zip` n'a pas changé. Sa copie intacte `CJAJLK-Precision-original-audit.zip` est toujours conservée dans les livrables.

SHA-256 commun, revérifié après les travaux :
`643E60BB7B7240BC48055A9897AB341C3DCCA6647F91694F7A47231BFD39D79C`

Les fichiers sources ont été modifiés dans le dossier du jeu, sans toucher à ce ZIP. Les scripts temporaires de préparation sont hors du projet. Le moteur et sa licence n'ont pas été modifiés.

## 2. Corrections du tir

### Collisions et impacts superposés

Le rayon ne teste désormais que les surfaces des cartons : les anciens trous et leurs bordures ne participent plus aux collisions. Le calcul du point et du score précède l'enregistrement du départ. Ensuite, un seul plomb est consommé, un seul tir est compté et un seul enregistrement est créé.

Le test de régression effectue quarante tirs au même point, avec rechargements nécessaires. Il vérifie aussi l'état après cinq coups : aucun plantage, quarante dessins, quarante entrées et un total correct. Ce test utilise la vraie géométrie Three.js avec rendu simulé ; il ne s'agit pas de quarante tirs manuels dans le navigateur.

### Plombs et clavier

Chaque arme conserve son propre stock pendant la session. La resélection ne remplit plus le stock. Un changement d'arme est bloqué pendant le rechargement et l'examen. Une nouvelle session réinitialise explicitement les stocks ; ce comportement est distinct de la reprise d'une session.

Espace répété par le système est ignoré pour carabine et pistolet. Le fonctionnement automatique historique reste disponible pour le fusil d'assaut. Le chargement de cinq plombs est conservé pour la carabine ; ce lot n'introduit pas de nouvelle interface de série ni de simulation mécanique complète du chargement d'une carabine de match.

## 3. Profil sportif et référentiel

Le nouveau profil impose carabine, 10 m, carton fixe et entraînement libre. Les autres paramètres restent accessibles via « Modes historiques ».

Dimensions et conversions sont centralisées dans `src/game/target-spec.js` : carton 80 mm, fond 170 mm, noir 30,5 mm, anneau extérieur 45,5 mm, point central blanc 0,5 mm et impact de diamètre 4,5 mm. La scène emploie les mètres ; le journal des tirs emploie les millimètres locaux au carton.

Référence effectivement consultée : [ISSF Rule Book 2026, édition 2025, premier tirage 12/2025, §6.3.4.3, page 194](https://backoffice.issf-sports.org/getfile.aspx?file=ISSF-Rule-Book-2026-Edition-2025-First-Print-12-2025-Effective-1-January-2026.pdf&inst=455&mod=docf&pane=1). Les tentatives d'accès au troisième tirage d'octobre 2026 n'ont pas abouti. Le référentiel retenu est documenté précisément dans `docs/LOT1-REFERENCE.md` ; aucune conformité officielle au dernier règlement n'est revendiquée.

Le score entier est une convention pédagogique explicite : le bord du plomb au contact d'un cordon donne la valeur de cet anneau. La convention et ses frontières sont testées. Elle n'est pas présentée comme une procédure certifiée de jauge papier ou comme un score décimal officiel.

Le compteur auparavant nommé « Précision » devient « Dans les anneaux ». Un taux de 100 % signifie que tous les départs ont marqué au moins un point ; il ne juge pas la qualité du groupement. Les statistiques avancées attendent le LOT 2.

## 4. Visée V2

En vue de stand, le carton garde sa taille physique. En épaulant, le joueur obtient une image de lecture agrandie, explicitement marquée « CONFORT VISUEL ×30/×45/×60 · SANS EFFET SUR LE SCORE ».

La visée sportive comporte un œilleton arrière sombre, un globe avant et un insert annulaire fin avec ses supports. Aucun point rouge ni guidon à lame. L'ouverture angulaire du guidon réserve un espace clair autour du noir lorsqu'il est centré ; cet espace varie en déplaçant la visée. Il n'y a pas d'aimantation vers la cible.

Choix technique : les organes de visée en vue épaulée sportive sont représentés en SVG/CSS, projetés à partir d'une ouverture angulaire commune. Le carton, les impacts, les collisions et le stand restent en 3D Three.js. Ce choix évite de transformer l'ancienne géométrie surdimensionnée en obstruction illisible lors du grossissement. La représentation n'est pas une simulation complète de l'optique de l'œil. Les modèles et optiques des modes historiques sont conservés.

Le champ de vision et les cercles sont adaptés au format d'écran. Le changement de confort agit sur la projection uniquement : les mètres du stand, les millimètres du carton et les points enregistrés ne changent pas. La distance de référence est 10 m longitudinalement entre l'œil virtuel et le plan de cible, avec une légère inclinaison vers le centre.

## 5. Pose, sensations et contrôles

Une pose angulaire filtrée unique alimente la caméra sportive. Le départ utilise la pose de cette caméra effectivement présentée ; il n'ajoute aucune dispersion aléatoire. Le journal mémorise aussi le rayon utilisé. Le recul sportif est visuel, appliqué après l'impact, sans déplacement caché du point de départ.

- Sensibilité réglable de 0,25 à 2.
- Filtrage exponentiel léger, constante de temps 25 ms.
- Respiration et oscillations lentes déterministes, désactivables.
- Aucun modèle prétendument exact de fatigue musculaire ou de physiologie.
- Espace ou clic pour tirer ; V ou clic droit pour épauler ; R pour recharger.
- La pause fige l'horloge utilisée par les mouvements et délais de jeu.

Le calcul du temps de jeu n'est plus plafonné à 0,05 s par image. Le test du défi vérifie qu'une seconde simulée fait bien avancer d'une seconde, et que l'examen suspend le défi historique.

## 6. Ramène-cible préservé

La machine de transport existante est conservée. Le profil sportif ramène son petit carton à 0,5 m et adopte une vue d'examen adaptée ; les modes historiques gardent leur cadrage rapproché.

Les impacts restent attachés au repère local du carton. Ni transport ni changement de caméra ne les déplacent sur le papier. Un appui sur T ramène, un deuxième renvoie. Après le renvoi et le retour de caméra, « Reprendre le tir [T] » demande un geste explicite pour restaurer le verrouillage souris lorsque le navigateur l'autorise. Si le navigateur refuse ce verrouillage, le contrôle de repli sur le canvas reste disponible.

Le tir est bloqué pendant le transport, l'examen, le retour de caméra et l'attente de reprise. Il n'y a pas de départ possible au milieu du mouvement de retour. Les choix de cartons et compteurs sont conservés.

## 7. Données minimales pour le futur LOT 2

Un journal en mémoire enregistre chaque départ : identifiant, profil, arme, cible effectivement touchée, cible choisie, instant de jeu, score, présence sur le carton, coordonnées locales en mm et paramètres de visée. Ceux-ci comprennent direction du rayon, origine, angles, oscillations, sensibilité et confort.

Un manqué peut conserver sa projection sur le plan de la cible choisie ; une projection impossible reste nulle. Il n'est pas transformé artificiellement en impact sur le carton. Le journal est indépendant des maillages et ne perd pas ses données lorsque la limite de 160 dessins supprime les plus anciens visuels.

Ce journal reste en mémoire et est réinitialisé à la nouvelle session. Aucun export, historique de séance, calcul de groupement, interface 5/20/40 ou sauvegarde de séance n'a été ajouté. Le record historique existant reste intact.

## 8. Validation exécutée

Commande :
`node --test tests/rules.test.mjs tests/carrier.test.mjs tests/sport.test.mjs tests/integration.test.mjs`

Résultat final : **19 tests réussis, 0 échec, 0 test ignoré**. Les quatre tests d'origine restent présents et passent. Aucun échec critique n'a été constaté pendant cette implémentation. Contrôle syntaxique complémentaire : 11 fichiers JS/MJS applicatifs et de test, sans erreur.

| Domaine | Vérification |
|---|---|
| Tirs superposés | 5 puis 40 coups au même point, impacts, journal, points et stocks vérifiés. |
| Plombs | Resélection et aller-retour entre armes sans recharge gratuite ; changement bloqué durant rechargement. |
| Clavier | Répétition Espace filtrée pour les armes semi-automatiques, automatique historique préservé. |
| Pause | Pas de départ ni progression de l'horloge ; reprise sans réinitialisation des plombs. |
| Transport | Retour/examen/renvoi, tir interdit, reprise explicite, coordonnées et dessins conservés. |
| Dimensions et score | Dimensions physiques, centres, cordons inclus/exclus, symétrie et entrées non finies. |
| Visée/impact | Pose affichée identique à celle enregistrée ; coordonnées vérifiées à moins de 0,1 mm dans le test de projection. |
| Confort et format | Même pose et même impact après changement du champ de vision et du rapport d'écran. |
| Filtrage | Reproductibilité et réponse stable à 30/144 étapes par seconde pour une entrée constante. |
| Historique | Trois armes disponibles, tailles historiques conservées, automatique et défi fonctionnels dans le banc. |
| Menu | Un changement de profil prépare une nouvelle session sans altérer les plombs de la session reprise. |
| Tactile simulé | Glissement, visée et bouton tir ; lever le doigt de tir ne perd plus le doigt de visée. |

Le banc d'intégration exécute le vrai code du jeu avec Three.js, mais simule DOM, renderer et certains événements. Les tests géométriques ne constituent donc pas des mesures GPU ni des essais physiques au téléphone.

### Essais navigateur PC

- Profil sportif chargé, commandes et réglages visibles.
- Vue épaulée inspectée visuellement : noir, espace clair et guidon annulaire sans point rouge.
- Espace : +10 points et stock de cinq à quatre.
- Examen à 0,5 m : un impact et dix points affichés, trou visible.
- Espace pendant examen : pas de nouvel impact ni point.
- Renvoi puis reprise explicite : un nouveau tir donne un total de vingt et un stock de trois.
- Console consultée pendant le parcours : aucune erreur ni alerte relevée.

Le navigateur a affiché la version à plusieurs largeurs de fenêtre. Aucun téléphone physique n'a été utilisé. L'outil navigateur ne proposait pas de vraie émulation tactile complète ; la validation tactile mentionnée est celle du banc d'événements, et ne doit pas être confondue avec un essai mobile réel.

### Limites restantes

Pas de validation exhaustive multi-navigateurs, d'endurance GPU, de mesure de latence matérielle ou d'écoute comparative des sons. Les 33 lumières, le style du stand et la vitesse historique du rail ne sont pas refondus dans ce lot. Le modèle de souffle est pédagogique. Les mises à jour du matériel ou les permissions souris peuvent modifier le ressenti selon le navigateur.

## 9. Fichiers concernés

Modifiés : `src/game/main.js`, `index.html`, `styles/main.css`, `package.json`, `README.md`, `docs/ASSETS.md`.

Ajoutés : `src/game/target-spec.js`, `src/game/aim.js`, `src/game/input.js`, `tests/harness.mjs`, `tests/sport.test.mjs`, `tests/integration.test.mjs`, `docs/LOT1-REFERENCE.md`.

Préservés : moteur Three.js et licence, `rules.js` historique, `carrier.js`, les deux fichiers de tests originaux, serveur local et lanceur. Les nouveaux réglages sportifs ne remplacent pas les règles historiques.

## 10. Validation utilisateur attendue

Ouvrir la version locale, recharger la page et choisir le profil sportif. Tester d'abord les oscillations désactivées, puis activées ; comparer les conforts visuels, tirer, ramener le carton et reprendre le tir. Le choix « Modes historiques » donne accès à l'ancien parcours.

Le développement s'arrête avec cette livraison. Aucune mise en ligne et aucun démarrage des lots suivants. La prochaine étape attend votre validation du LOT 1.
