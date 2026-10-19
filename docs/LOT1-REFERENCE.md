# Référentiel et conventions du LOT 1

Référence géométrique retenue : ISSF Rule Book 2026, Edition 2025, First Print 12/2025, Effective 1 January 2026, §6.3.4.3, page imprimée 194.
Source primaire consultée le 19 octobre 2026 : https://backoffice.issf-sports.org/getfile.aspx?file=ISSF-Rule-Book-2026-Edition-2025-First-Print-12-2025-Effective-1-January-2026.pdf&inst=455&mod=docf&pane=1

Le passage accessible confirme les diamètres des dix anneaux, le noir, le point central blanc, le carton visible et le fond de cible. Les tentatives d'ouverture du troisième tirage d'octobre 2026 n'ont pas abouti. Cette version fige donc le référentiel effectivement consulté et ne revendique pas de conformité officielle au dernier règlement.

Dimensions centralisées dans src/game/target-spec.js :
- Anneaux du 10 au 1 : 0,5 ; 5,5 ; 10,5 ; 15,5 ; 20,5 ; 25,5 ; 30,5 ; 35,5 ; 40,5 ; 45,5 mm de diamètre.
- Noir : 30,5 mm ; centre blanc : 0,5 mm ; carton : 80 × 80 mm ; fond : 170 × 170 mm.
- Plomb simulé : 4,5 mm. Son diamètre est utilisé pour l'impact et le score pédagogique.
- 1 unité de scène = 1 m ; impact du journal exprimé en mm locaux au carton, x vers la droite, y vers le haut.
- Le plan de cible est à 10 m longitudinalement de l'œil virtuel. La hauteur de centre retenue dans la scène est 1,40 m ; l'œil reste à 1,65 m et la pose initiale s'oriente vers ce centre.

Score : parcourir les anneaux du plus élevé au plus faible ; marquer l'anneau si distance du centre du plomb ≤ rayon de l'anneau + rayon du plomb. Égalité incluse, tolérance numérique 1e-9 mm. Ce modèle entier explicite n'est ni une simulation de toutes les procédures de jauge papier, ni un score décimal officiel.

Visée : filtre exponentiel 25 ms, sinusoïdes lentes et reproductibles de faible amplitude. Aucune dispersion aléatoire ajoutée au profil sportif. Oscillations désactivables. Le tir utilise la pose de caméra affichée ; le recul de ce profil est uniquement visuel et appliqué après l'enregistrement.

Confort : ×30/×45/×60 correspond à un grossissement d'affichage de référence par rapport au champ vertical 55° ; le cadrage portrait est adapté. Ce n'est pas une lunette montée sur la carabine. L'ouverture du guidon est projetée à partir d'un angle de 2 mrad de rayon, indépendamment du format écran, soit une ouverture apparente de 40 mm à 10 m. Le noir occupe environ 76 % de cette ouverture lorsqu'il est centré.

Les anneaux du dioptre/guidon sportif sont dessinés en SVG/CSS comme représentation de visée angulaire ; les cibles, les impacts, les collisions et le stand restent dans la scène Three.js. Pas d'aimantation de la cible. La simulation ne prétend pas reproduire la fatigue musculaire ou l'optique physiologique.
