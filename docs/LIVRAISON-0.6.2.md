# CJAJLK Précision 0.6.2 — Livraison du 6 novembre 2026

## Inspection préalable

La version HTTPS publiée et le dépôt local annonçaient tous deux 0.6.1. Dépôt propre sur main avant intervention. Application statique, modules JavaScript natifs, Three.js déjà fourni localement, aucun gestionnaire de compte et aucune nouvelle dépendance. Les données du simulateur sont enregistrées dans cjajlk-precision-sessions et cjajlk-precision-best. Elles ne sont ni converties ni effacées.

Copie initiale intacte : E:\cj_project\CJAJLK-Precision-avant-0.6.2.zip (archive Git de la version initiale).

## Tir réel : Mon carnet

Accès depuis le menu principal, ou directement carnet/index.html. Module indépendant de la 3D, utilisable même sans WebGL. Interface bleu nuit, violet et cyan, formulaires tactiles, historique sans graphique et progression sur une page distincte.

- Date/heure locale modifiable, carabine 10 m en notation entière, formats 10/20/30/40/60 et personnalisé de 1 à 1 000 plombs ; 30 par défaut.
- Entraînement, compétition ou autre, notes et photo facultatives. Photos réduites à 1 200 pixels maximum, JPEG de 750 000 caractères maximum ; erreur explicite si le quota du navigateur est atteint.
- Saisie rapide : total validé, maximum, pourcentage, moyenne. Aucun score individuel reconstitué.
- Saisie détaillée : séries de longueur libre, couleurs, correction, suppression confirmée des tirs, incertains sans valeur inventée, contrôle du nombre prévu. Total provisoire et scores connus distingués.
- Sauvegarde automatique après chaque modification valide, Enregistrer et continuer, reprise après rechargement, Terminer avec validation de complétude. Un total rapide est conservé comme référence en passant au détail, sans doublon de séance.
- Historique filtré par jour/mois/année/discipline/format, fiche, modification, reprise, suppression confirmée.
- Progression séparée par discipline, règles et nombre de plombs. Colonnes, moyenne mobile sur cinq séances maximum, record/moyenne/dernière évolution. Détails accessibles par boutons tactiles sous les colonnes et titres au survol. Seconde vue : écart-type des points, exclusivement pour le détail connu ; aucune prétention à mesurer le groupement physique.
- Fiche individuelle imprimable et bilan mensuel des séances cochées avec synthèses séparées par format.
- Imprimer et Exporter PDF ouvrent l’impression système : choisir Enregistrer au format PDF. Ce n’est pas une génération PDF indépendante du navigateur. Aide de secours affichée.
- Carte PNG de résultat, téléchargement et partage natif si le navigateur accepte les fichiers. À défaut : téléchargement. Carte sans notes, photo, nom ni club ; ces deux derniers ne sont pas collectés. Aucun envoi automatique.

## Sauvegarde et hors ligne

Clé locale séparée : cjajlk-real-notebook-v1. Export JSON intégrant les photos ; import validé intégralement avant écriture, identifiants déjà présents ignorés pour protéger la version locale. Les archives contenant des identifiants répétés, des dates invalides, une discipline non prise en charge ou une photo non JPEG sont refusées. Un échec de lecture bloque l’écriture et propose de récupérer les données brutes. Détection de modification dans un autre onglet et avertissement de données non enregistrées à la fermeture.

Service worker limité aux ressources de cette application, cache nommé par version, fichiers locaux, aucune ressource CDN. Les anciennes données locales ne sont pas touchées lors de l’activation. Manifeste et icônes PNG pour ajout à l’écran d’accueil. Le cache peut être supprimé par le navigateur ; garder un export JSON, notamment avant nettoyage/changement de téléphone. L’import ne fusionne pas deux versions différentes d’une même séance : la séance déjà présente gagne.

## Simulateur

Après chaque départ sportif : sortie de visée, petit déplacement déterministe de la position, rechargement manuel obligatoire puis nouvelle action V / VISÉE (ou clic droit) avant le départ suivant. Aucun tir à vide, aucun remplissage par changement de vue/arme. Armes historiques conservées.

Trois profils Découverte/Entraînement/Simulation, respiration verticale et horizontale déterministe avec stabilisation progressive. La caméra rendue reste celle du rayon de tir, sans pénalité invisible. Fatigue facultative après maintien prolongé, flou léger plafonné à 0,65 pixel sur la scène, visée annulaire superposée restant nette ; récupération hors visée/en pause. Découverte désactive le flou.

## Vérifications effectuées

39 tests Node réussis, 0 échec : calculs carnet, validation/import/doublons, séparation de formats, reprise et préservation du simulateur, cache hors ligne, transitions du rechargement, reprise de position, fatigue, anciens scénarios physiques et historiques.

Scénario navigateur carnet : création 30, cinq tirs, sauvegarde, rechargement réel de la page, reprise, douze séries de deux et dernier plomb incertain, refus de clôture, correction, refus du 31e tir, clôture à 282/300. Saisie rapide 350/400, progressions séparées, absence de régularité inventée, sélection mensuelle, contrôles de boutons ≥44 px et absence de débordement horizontal à 390×844, 844×390 et 1280×800. Les données temporaires du carnet sont restaurées après ces tests.

Scénario exports : photo synthétique réduite, génération de la carte et signature PNG, JSON avec photo, réimport sans doublon, import invalide sans modification. Les téléchargements système y sont interceptés pour vérifier les fichiers générés. Les deux boutons d’impression appellent bien window.print (appel simulé dans ce test).

Scénario simulateur WebGL : 40 tirs avec rechargement et reprise de visée entre chaque, 8 cartons, blocage du 41e, sauvegarde, ramène-cible, pause, commandes tactiles ≥44 px sans chevauchement en portrait/paysage. Événements tactiles synthétiques.

Hors ligne : serveur local réellement arrêté, requête réseau indépendante refusée ; rechargement du carnet et navigation vers Sauvegardes réussis grâce au cache. Inspection visuelle du carnet sur PC réalisée.

## Limites clairement identifiées

Aucun Samsung Galaxy S25 FE, appareil Android physique, imprimante ou dialogue de partage Android utilisé. Aucun PDF final produit par le dialogue système pendant les tests automatisés. L’impression PDF et le partage natif dépendent du navigateur ; les alternatives et consignes sont visibles. L’installation à l’écran d’accueil Android n’a pas été exécutée. Le hors ligne a été vérifié dans le navigateur de bureau avec serveur local arrêté, pas en mode avion sur un téléphone.

Une seule discipline est activée ; le registre des règles permet d’en ajouter sans appliquer implicitement celles de la carabine. La notation décimale n’est pas activée. Stockage local au navigateur, sans synchronisation cloud.

## Pour la séance du 7 novembre

Ouvrir le carnet avec Internet une première fois et attendre « Carnet prêt hors ligne ». Nouvelle séance → 30 plombs → saisie détaillée. Ajouter une série quand le carton revient, quelle que soit sa longueur. Enregistrer et continuer pour une pause, Terminer uniquement quand les 30 scores sont connus. Exporter la sauvegarde JSON à la fin. Pour l’impression : fiche → Exporter PDF → Enregistrer au format PDF si proposé.
