# Version 0.6.1 — Carabine sportive à un coup

Le profil sportif commence avec un seul plomb chargé. Après chaque départ, il reste déchargé jusqu'à l'action R ou RECHARGER. Tirer à vide ne lance jamais de rechargement automatique en sport. Les trois armes historiques conservent leurs capacités et comportements.

L'état chargé est affiché séparément de la progression 0/5 à 5/5 des cartons de séances. En entraînement libre, le compteur total de tirs reste distinct du chargement. Le mouvement de rechargement dure 1,8 seconde : abaissement puis retour progressif de la carabine. La pause suspend cette durée. Aucun tir n'est autorisé pendant le mouvement.

Les changements de vue, recentrage, sélection d'arme, pause/reprise et passage au carton suivant ne chargent aucun plomb. Changer le profil dans les réglages prépare une nouvelle séance ; reprendre conserve l'état de la séance actuelle. Seul le bouton explicite de nouvelle séance réinitialise celle-ci avec son plomb initial.

29 tests automatisés passent : transitions 1→0→rechargement→1, blocage à vide et pendant le chargement, R maintenu, tir maintenu, pause, vues/armes/profil, cartons, tactile et capacités historiques. Les tests de séries précédents rechargent maintenant entre chaque départ au lieu de tous les cinq départs.

Le scénario navigateur mobile de 40 tirs vérifie désormais chaque tentative à vide, le message de rechargement, l'action RECHARGER et le blocage pendant l'animation. Événements tactiles synthétiques : aucun téléphone physique testé.

Validation navigateur terminée le 29 octobre 2026 : 40 tirs, 8 cartons, tentatives à vide et pendant rechargement bloquées, sauvegarde, ramène-cible, pause, boutons de 44 px minimum sans chevauchement en 390×844 et 844×390. Tous les contrôles du scénario ont réussi. Une erreur MutationObserver a été capturée par le navigateur ; aucun usage de cette API dans le projet et aucune défaillance du scénario, origine non déterminée.
