# CJAJLK Précision — V0.6.3

## Inspection et conservation

La version publiée en HTTPS avant intervention était 0.6.2, déploiement GitHub terminé avec succès, dépôt local propre. Les données restent sous la même clé cjajlk-real-notebook-v1 et au même format d’enveloppe JSON version 1. Aucun effacement ni migration destructive n’est exécuté. Copie du projet initial : E:\cj_project\CJAJLK-Precision-avant-0.6.3.zip.

Le code du simulateur et ses règles de calcul ne sont pas modifiés. Seul le libellé de version du lien vers le carnet change dans son menu.

## Fonctionnalités livrées

- Nombre de plombs par cible indépendant du nombre total : 2, 3, 5, 10 ou personnalisé (1 à 1 000). Initialement 5 ; préférence locale pour les nouvelles séances, sans compte ni profil supplémentaire.
- Navigation par cible, numéros des tirs, totaux connus et incertains, ajout progressif dans l’ordre, passage automatique à la cible suivante, dernière cible partielle. Correction des tirs des cibles précédentes sans déplacement des valeurs dans les séries d’origine.
- Les cibles sont une vue des tirs ordonnés : les tableaux de séries existants sont conservés. Une ancienne séance sans nombre par cible reste présentée comme séries manuelles ; choisir explicitement un nombre par cible crée une vue regroupée, sans modifier les séries ni leur score ni le statut terminé. Aucune répartition n’est inventée pour une saisie rapide.
- Cartes compactes sur les fiches : cible ou série manuelle clairement distinguée, points, plage des numéros, total/maximum, nombre de tirs et incertains. Pas de tableau serré sur téléphone.
- Cible illustrative facultative dans la saisie et dans les cartes des fiches. Positions déterministes, numéros et légende ; zéro à l’extérieur et incertains sans position supposée. Schéma normalisé des zones de score, pas une reconstruction métrique des impacts. Aucune dispersion physique ni décalage directionnel calculé. Les illustrations ouvertes sur la fiche peuvent être imprimées avec leur mention illustrative.
- Notifications succès, information, avertissement et erreur, icône, titre et fermeture. Confirmations ordinaires effacées après 4 secondes ; erreurs persistantes. Notifications dans le flux de page pour ne pas recouvrir les boutons. Sauvegarde automatique discrète « Enregistré », sans toast par plomb. Message d’erreur également à proximité de la saisie par cible.
- Suppressions de séance et de plomb confirmées dans un dialogue HTML personnalisé : date, avertissement définitif, Annuler, Supprimer définitivement. Focus initial sur Annuler, focus restitué, fermeture par Échap et par retour navigateur, aucun effacement par simple fermeture. Dialogue modal avec titre et description accessibles. Impression et permissions système conservées.
- Bilan facultatif : fatigue, concentration, stabilité, gêne, lunettes, type, notes d’équipement/conditions. Choix explicite d’affichage sur fiche et impression/PDF. Toujours absent de la carte partagée. Les sauvegardes JSON conservent les champs saisis, même masqués sur la fiche. Aucun diagnostic ni analyse de causalité.
- Historique, progression par format total et notation, graphiques, photos, partage PNG, impression/PDF via navigateur, sauvegardes et hors ligne conservés. Le nombre par cible ne crée pas une catégorie de progression.

## Vérifications

45 tests Node réussis : suite précédente, 30/5 → 6 cibles, 30/10 → 3, 30/4 → 8 dont une de 2, correction et totaux, reprise JSON, conservation exacte des anciennes séries, placement déterministe dans les anneaux, 10 impacts numérotés, champs facultatifs validés, progression non fragmentée, cache et simulateur.

Parcours navigateur V0.6.3 réussi : saisie progressive, passage automatique, sauvegarde puis rechargement, positions inchangées, affichage/masquage, correction d’une cible précédente et recalcul, score invalide refusé, toast de succès et expiration, erreur, sensations sur fiche/masquées à la demande, cartes sans débordement à 320/360/390 px, bouton Ajouter ≥44 px, annulation/focus/retour navigateur/suppression confirmée, préférence mémorisée, ancien carton de 30 tirs préservé après regroupement explicite, statut terminé conservé.

Parcours de compatibilité V0.6.2 rejoué : séries manuelles variables, 30 tirs et résultat 282/300, saisie rapide 350/400, filtres mensuels, progressions séparées, sauvegarde et reprise, tailles de boutons et dispositions portrait/paysage/PC.

Parcours exports rejoué : compression photo, génération PNG, JSON contenant photo et séance, réimport sans doublon, import invalide sans perte. Appels Imprimer et Exporter PDF vérifiés par simulation de window.print ; aucun dialogue natif remplacé dans l’application.

## Limites des essais

Essais navigateur et événements simulés, aucun Samsung Galaxy S25 FE ni Android physique utilisé par l’agent. Le retour a été testé via l’historique navigateur, pas via un bouton matériel Android. Pas de lecteur d’écran physique testé ; sémantique de dialogue, rôle, focus initial et annulation contrôlés. Aucun PDF final produit par un dialogue d’impression Android pendant ces tests ; l’export PDF reste celui du navigateur. Aucun partage social envoyé. Les fichiers des tests d’export sont interceptés pour vérifier leur contenu sans envoi système.

Les positions illustratives sont seulement pédagogiques. Au-delà de dix tirs sur une cible, la légende conserve les numéros/points ; les traits de repérage extérieurs sont omis pour ne pas surcharger le dessin.

## Mise à jour hors ligne

Cache dédié cjajlk-precision-0.6.3 avec les nouveaux modules du carnet. Activation après préchargement complet, suppression des anciens caches de ressources propres à cette application uniquement ; stockage des séances et préférences conservé. Lecture de secours dans le cache de la version active. Recharger la page avec une connexion pour recevoir V0.6.3, sans vider les données du navigateur.

Contrôles complémentaires terminés : parcours navigateur du simulateur réussi sur 40 tirs, rechargements, ramène-cible et dispositions tactiles. Cache V0.6.3 vérifié avec les sept ressources du carnet. Serveur local arrêté, rechargement du carnet V0.6.3 et navigation Sauvegardes réussis hors ligne.
