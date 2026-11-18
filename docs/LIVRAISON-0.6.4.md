# Livraison V0.6.4 — Carnet de tir réel

Date : 18 novembre 2026. Projet : `E:\cj_project\CJAJLK-Precision`, branche `main`.

## Inspection et préservation

La V0.6.3 possédait déjà les cartons configurables, les séries manuelles, la saisie rapide, les corrections, les sensations, les illustrations facultatives, les sauvegardes et les exports. Ces mécanismes ont été conservés. Une copie du point de départ est disponible dans `E:\cj_project\CJAJLK-Precision-avant-0.6.4.zip`.

Aucune dépendance ajoutée, aucune monnaie CJ, aucun changement dans `src/game` ou dans les styles du simulateur. Seul son lien de version vers le carnet évolue.

## Changements

- Onze grandes touches 0–10 : un appui enregistre immédiatement. Pas de champ numérique ni d'ouverture volontaire du clavier dans la saisie par carton. Filtre de 450 ms contre les doubles appuis ; deux scores identiques restent possibles après ce délai.
- Confirmation discrète avec numéro de tir et total ; annulation du dernier tir ; correction d'un ancien score en touchant son bouton puis le nouveau score. Ordre et séries d'origine conservés, sauvegarde automatique.
- Réglages de séance repliables pour accéder rapidement au pavé. Touches d'au moins 56 pixels de hauteur sur les petits écrans.
- Cartons de 5, 10 ou d'un autre nombre, dernier carton partiel, passage automatique au suivant. Fonctionnement également sur les séances anciennes sans imposer de format de carton.
- Résultats par cible sous forme de barres, repérage des plus fortes/faibles parmi les cibles entièrement renseignées. Comparaison en pourcentage du maximum pour traiter le dernier carton partiel.
- Histogramme 0–10, groupes 0–3 / 4–6 / 7–10, effectifs, pourcentages et moyenne. Les incertains sont comptés à part et exclus du dénominateur ; les séances rapides ne produisent pas de scores individuels inventés.
- Dans Progression : comparaisons des cibles et de la proportion des tirs faibles entre séances détaillées terminées ayant même discipline, total et nombre par carton. Les graphiques existants de score/régularité restent présents.
- Option écran allumé, uniquement sur demande. Libération à la sortie de séance, gestion des demandes tardives, interruptions et retours d'onglet ; message en cas de refus/absence de support et rappel de consommation de batterie.
- Chronomètre libre et minuteur personnel : démarrer, pause, reprendre, remise à zéro. Son/vibration facultatifs selon le navigateur. Aucun temps réglementaire annoncé ni arrêt forcé de séance. Horloge temporaire, non persistée, mise en pause en quittant la séance ; les alertes peuvent être retardées en arrière-plan.
- Observation facultative des tirs ratés. Elle suit le choix de confidentialité du bilan sur fiche/PDF et n'apparaît pas sur la carte PNG.
- Cache hors ligne V0.6.4 comprenant les nouveaux modules.

## Données et limites

La clé de stockage et l'enveloppe JSON version 1 sont inchangées. L'observation des tirs ratés est un champ facultatif validé ; aucune migration destructive n'est nécessaire. Les données du simulateur restent séparées. Les protections existantes contre les conflits entre onglets et les erreurs de stockage sont conservées.

Les positions sur la cible restent explicitement illustratives, sans coordonnées mesurées ni mesure géométrique de dispersion. Une baisse de score ne constitue pas un diagnostic de fatigue.

Le PDF utilise toujours la fonction d'impression du navigateur. Le partage dépend des capacités du navigateur. Aucun essai sur Samsung Galaxy S25 FE physique n'a été réalisé ; les largeurs mobiles sont testées en navigateur de bureau.

## Validation

52 tests Node réussis : règles du simulateur, rechargement à un coup, coordonnées, carrier, sauvegardes, anciens imports, statistiques, annulation, antidoublon, horloge et gestion simulée de Screen Wake Lock.

Les scénarios navigateur sont regroupés dans `tests/browser-suite.html` : tests existants adaptés au pavé, nouveau parcours V0.6.4, carnet historique, exports, tactile du simulateur et cache. Les tests de carnet sauvegardent puis restaurent les données locales initiales. Le test V0.6.4 couvre aussi un échec de stockage simulé.

Documentation de référence pour l'écran allumé : https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API

Résultat navigateur du 18 novembre : les six scénarios de la suite ont atteint « SUCCÈS GLOBAL » dans Microsoft Edge. Les exports JSON/PNG sont contrôlés sur les fichiers générés en mémoire ; les boutons PDF/impression sont vérifiés par interception de l'appel à l'impression. Aucun PDF natif final, partage système, son/vibration réel ou maintien d'écran sur téléphone physique n'est revendiqué. Les essais mobiles à 320, 360 et 390 pixels, reprise, corrections et stockage indisponible ont réussi. Le simulateur WebGL a terminé ses 40 tirs et ses contrôles portrait/paysage sans régression détectée.
