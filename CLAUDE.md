# CLAUDE.md : site sub2cad.fr

Mode d'emploi pour un agent IA (Claude Code, Cursor...) qui modifie ce site. Le lire avant toute modification.

## Le site
- Site de Sub2Cad, membre du réseau Ohmycad. Langue : français.
- Générateur : Eleventy 2 (`npm run build` → `_site/`, `npm run serve` pour prévisualiser en local).
- Hébergement : Cloudflare Pages, projet relié à `Ohmycad/site-sub2cad`. **Chaque push sur `main` met le site en ligne en 1 à 2 minutes.** Adresse technique : https://sub2cad.pages.dev
- Accueil : src/index.html (page unique, HTML écrit à la main).
- Pages légales : src/mentions-legales/index.html et src/confidentialite/index.html.
- Scripts : src/js/main.js (constante S2C_FORM), src/js/consent.js, src/js/lead-form.js.

## Publier un article de blog
1. Créer `src/blog/<slug-court>.md` avec cet en-tête :
   ```
   ---
   title: "Titre de l'article"
   date: AAAA-MM-JJ
   category: "SOLIDWORKS"
   excerpt: "Une ou deux phrases, reprises dans la liste du blog et par Google."
   author: "Équipe Sub2Cad"
   cover: "/assets/img/blog/nom-image.webp"   # optionnel
   ---
   ```
2. Écrire le corps en Markdown (intertitres `##`, paragraphes courts, liens vers `/#contact` pour la prise de rendez-vous).
3. Images : `src/assets/img/blog/`, en .webp de préférence, moins de 300 Ko.
4. `npm run build` pour vérifier qu'il n'y a pas d'erreur, puis commit et push sur `main`.
L'article apparaît sur /blog/, dans sa catégorie et dans le sitemap automatiquement.

## Règles à ne jamais enfreindre
- **Aucun prix Dassault Systèmes** sur le site (licences, rôles, remises), sauf Ohmycare à 50 € par mois.
- **Mention réseau** : uniquement celle-ci, ne pas la reformuler en « n°1 Dassault Systèmes » ni l'attribuer à Sub2Cad :
  « Sub2Cad s’appuie sur Ohmycad, réseau spécialisé 3DEXPERIENCE et premier revendeur 3DEXPERIENCE au monde en 2025 : vous avez un interlocuteur local, avec la force d’un réseau mondial. »
- **Pas d'avis, de note ni de témoignage** qui ne soient pas ceux de Sub2Cad (les avis Google d'Ohmycad ne sont pas ceux du partner).
- **Ne pas toucher** au formulaire de contact (formulaire HubSpot `c2a45aeb-b304-4c67-a9e1-3fbe4c65dfa5`, qui notifie François Ratinaud), à `consent.js` (bandeau cookies, HubSpot ne se charge qu'après « Accepter ») ni à `lead-form.js`.
- **Ne pas supprimer ni vider** les pages légales.
- Pas d'ajout de traceur, pixel ou script tiers sans passer par le bandeau de consentement.
- La page /blog/ reste en noindex tant qu'aucun article n'existe (géré automatiquement). Au premier article, ajouter un lien « Blog » vers /blog/ dans le menu et le pied de page de src/index.html.

## En cas de doute
Ne rien publier et demander à Ohmycad (Victor Roux).
