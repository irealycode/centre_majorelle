# Centre Dentaire Majorelle — site web

Site statique bilingue (français + arabe) pour le Centre Dentaire Majorelle,
boulevard Mohammadia, Tétouan.

Pas de framework, pas de base de données, pas de dépendance côté navigateur.
`node build.mjs` produit un dossier `dist/` que l'on peut héberger n'importe où.

**→ Commencez par la section [« À remplacer avant la mise en ligne »](#à-remplacer-avant-la-mise-en-ligne).**
Certaines informations sont des suppositions et doivent être corrigées.

---

## Démarrage

```bash
npm install          # facultatif : installe esbuild (minification) et Playwright (captures)
npm run build        # génère dist/
npm run serve        # aperçu sur http://localhost:4321
npm run check        # SEO, liens, données structurées, textes alternatifs
npm run contrast     # vérifie tous les contrastes de la palette
npm run a11y         # audit axe-core (nécessite `npm run serve` en parallèle)
```

Pour régénérer les images, le logo découpé et les icônes (nécessite Python + Pillow) :

```bash
npm run images
```

Le site fonctionne sans `npm install` : la seule différence est que le CSS et le
JS ne sont pas minifiés (environ 10 Ko de plus une fois compressés par l'hébergeur).

---

## À remplacer avant la mise en ligne

Tout est regroupé dans **`src/site.mjs`**. Chaque ligne à corriger porte un
commentaire `TODO`.

### Indispensable

| Quoi | Où | Actuellement |
| --- | --- | --- |
| **Orthographe arabe du nom** | `site.dentistAr` | « الدكتور زكندري » — translittération de « Zeguendry ». Le nom latin vient du logo officiel ; **l'orthographe arabe reste à confirmer**, ainsi que le titre exact et l'éventuelle spécialité. |
| **Nom de domaine** | `site.origin` | `https://centredentairemajorelle.ma` — inventé. **Sur GitHub Pages, inutile d'y toucher** : l'adresse réelle est détectée à chaque déploiement. À corriger seulement pour un autre hébergeur, car elle alimente les URL canoniques, le hreflang et le sitemap. |
| **Adresse e-mail** | `site.email` | `contact@centredentairemajorelle.ma` — inventée. |
| **Numéro dans la rue** | `site.street` | « Boulevard Mohammadia » sans numéro. |
| **Horaires** | `site.hours` | Lun–Ven 9h–13h / 15h–19h30, Sam 9h–14h, Dim fermé — **supposés**. Ils alimentent à la fois le tableau affiché, le badge « Ouvert / Fermé » en direct et le `openingHoursSpecification` de Google. |

### Fortement recommandé

| Quoi | Où |
| --- | --- |
| **Lien Google Business Profile** | `site.social.googleMaps` — c'est le levier n°1 du référencement local à Tétouan. Si la fiche n'existe pas encore, créez-la avant tout le reste. |
| **Facebook / Instagram** | `site.social` — laissés vides, ils disparaissent automatiquement du pied de page et des données structurées. |
| **Espagnol** | `site.languages` — ajoutez `'es'` si l'équipe reçoit aussi en espagnol (proximité de Ceuta). |

### Textes à faire valider

Ces passages affirment quelque chose que je n'ai pas pu vérifier. Ils sont
marqués `TODO` dans `src/content/fr.mjs` et `src/content/ar.mjs` :

- **Biographie du Dr Zeguendry** — entièrement à réécrire (diplômes, année d'installation, parcours).
- **Protocole de stérilisation** — la description doit correspondre à la réalité du cabinet.
- **Remboursement CNSS / AMO / mutuelles** — ce que le cabinet remet exactement au patient.
- **Accueil des enfants** — supprimez la question si le cabinet ne reçoit pas d'enfants.
- **Créneaux d'urgence quotidiens** — la page Urgences l'affirme ; à confirmer.
- **Conduite à tenir en urgence** (paracétamol, pas d'aspirine…) — **à faire valider par le praticien** avant publication.
- **En dehors des heures d'ouverture** — indiquez le vrai relais (garde, service d'urgence local).
- **Stationnement, accès de plain-pied, langues parlées** — à confirmer.
- **Points de repère** dans `contact.accessBody` — ajoutez un carrefour, un commerce voisin, une ligne de bus. C'est ce qui aide vraiment les gens à trouver.

---

## Photos

Les photos du cabinet et de la façade sont les vôtres et sont déjà en place.
Le reste attend de vraies images.

| Emplacement | État |
| --- | --- |
| Logo (en-tête et pied de page) | ✅ votre logo officiel, découpé automatiquement — « DENTAL CLINIC » et « by dr Zeguendry » retirés |
| Accueil (héros, page « Le cabinet ») | ✅ votre photo |
| Façade de nuit | ✅ votre photo |
| Vue de Tétouan | ⚠️ photo Wikimedia (Ideophagous, CC BY-SA 4.0), créditée en pied de page. Remplacez-la par une photo à vous et supprimez le crédit. |
| **Portrait du Dr Zeguendry** | ❌ emplacement vide (800 × 1000 px) |
| **Salle de soins** | ❌ emplacement vide (1600 × 1100 px) |
| **Salle de stérilisation** | ❌ emplacement vide (1600 × 1100 px) |

Les emplacements vides s'affichent comme des cadres gris explicites — jamais
comme une photo d'un autre cabinet ni le visage d'un inconnu.

**Pour ajouter une photo :**

1. Déposez l'original dans `assets/img/src/` (le plus grand possible).
2. Déclarez-le dans `PLAN`, au début de `tools/images.py`.
3. `npm run images && npm run build`.

Le script fabrique automatiquement les versions AVIF, WebP et JPEG en plusieurs
largeurs. Il n'agrandit jamais une image : vos photos actuelles font 1448 px de
large, des originaux plus grands donneront un rendu plus net sur grand écran.

---

## Mise en ligne

Le dossier `dist/` est un site statique ordinaire.

### GitHub Pages (recommandé ici — gratuit, HTTPS inclus)

Le déploiement est automatique : `.github/workflows/deploy.yml` reconstruit et
publie le site à chaque `git push` sur `main`, et bloque la publication si
`tools/check.mjs` trouve un lien cassé ou une donnée structurée invalide.

**Première mise en place**

1. Créez un dépôt sur GitHub (par exemple `centre-dentaire-majorelle`).
2. Dans le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Site du Centre Dentaire Majorelle"
   git branch -M main
   git remote add origin https://github.com/VOTRE-NOM/centre-dentaire-majorelle.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : « GitHub Actions »**.
4. Onglet **Actions** : attendez la coche verte (1 à 2 minutes). Le site est en
   ligne sur `https://VOTRE-NOM.github.io/centre-dentaire-majorelle/`.

Vous n'avez **rien à configurer** pour l'adresse : le workflow demande à GitHub
où le site est publié et construit les URL canoniques, le hreflang, le sitemap
et tous les chemins en conséquence.

**Avec votre propre nom de domaine (fortement conseillé pour le SEO)**

Une adresse `github.io/nom-du-depot` fonctionne, mais elle pénalise le
référencement : les moteurs ne lisent `robots.txt` qu'à la racine du domaine
(celui du dépôt est ignoré), l'adresse n'inspire pas confiance à un patient, et
elle ne correspond pas à la fiche Google Business Profile. Pour un cabinet, un
domaine `.ma` vaut largement ses quelques centaines de dirhams par an.

1. Chez votre registraire, créez les enregistrements DNS :
   - pour `www.votre-domaine.ma` : un **CNAME** vers `VOTRE-NOM.github.io`
   - pour `votre-domaine.ma` : quatre **A** vers `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
2. **Settings → Pages → Custom domain** : saisissez le domaine, puis cochez
   **Enforce HTTPS** une fois le certificat émis (jusqu'à 24 h).
3. Relancez le workflow (onglet Actions → *Run workflow*). Il détecte le domaine
   et reconstruit toutes les URL dessus, sans modifier aucun fichier.

Ne remplissez **pas** le domaine avant que le DNS pointe vers GitHub : Pages
redirigerait alors vers une adresse qui ne répond pas, et le site serait hors
ligne.

**Ce que GitHub Pages ne fait pas** : il ignore `_headers` (en-têtes de sécurité
et de cache personnalisés). Il compresse et met en cache correctement de
lui-même, donc les performances ne changent pas ; si vous tenez aux en-têtes de
sécurité, Cloudflare Pages ou Netlify les appliquent.

**Tester localement comme sur GitHub Pages** (sous un sous-dossier) :

```bash
# Git Bash sous Windows : MSYS_NO_PATHCONV=1 est indispensable,
# sinon « /centre-dentaire-majorelle » est transformé en chemin Windows.
MSYS_NO_PATHCONV=1 BASE_PATH=/centre-dentaire-majorelle npm run build
MSYS_NO_PATHCONV=1 BASE_PATH=/centre-dentaire-majorelle npm run serve
# → http://localhost:4321/centre-dentaire-majorelle/
```

### Autres hébergeurs

**Netlify / Cloudflare Pages** (gratuit, HTTPS inclus) :
glissez-déposez `dist/`, ou connectez le dépôt avec `node build.mjs` comme
commande de build et `dist` comme dossier publié. Le fichier `_headers` inclus
gère déjà le cache et les en-têtes de sécurité.

**Hébergeur classique (cPanel, OVH…)** : envoyez le contenu de `dist/` à la
racine web. `_headers` n'y est pas lu ; activez la compression gzip/brotli
depuis le panneau, ou ajoutez un `.htaccess`.

### Après la mise en ligne

1. Vérifiez que `site.origin` correspond bien au domaine réel, puis reconstruisez.
2. Déclarez le site dans **Google Search Console** et soumettez `https://votre-domaine/sitemap.xml`.
3. Créez ou réclamez la fiche **Google Business Profile** — mêmes nom, adresse et
   téléphone qu'ici, au caractère près. Cette cohérence (le « NAP ») pèse lourd
   dans le référencement local.
4. Testez les données structurées : <https://search.google.com/test/rich-results>.

---

## Structure

```
src/site.mjs           Toutes les informations du cabinet — le seul fichier à éditer en général
src/content/fr.mjs     Tout le texte français
src/content/ar.mjs     Tout le texte arabe
src/render.mjs         Les gabarits HTML
src/schema.mjs         Les données structurées (JSON-LD)
build.mjs              Génère dist/
.github/workflows/      Déploiement automatique sur GitHub Pages
assets/css/site.css    La feuille de style
assets/js/site.js      Les animations et le badge « Ouvert »
assets/LOGO_full.png   Le logo fourni (non publié tel quel)
assets/img/src/        Les photos originales (non publiées)
tools/logo.py          Découpe le logo (monogramme, MAJORELLE, bloc complet)
tools/                 Images, icônes, contrastes, accessibilité, serveur, captures
dist/                  Le site généré — c'est ce qu'on met en ligne
```

Le téléphone, l'adresse et les horaires ne sont écrits **qu'une seule fois**,
dans `src/site.mjs`. Changez-les là et ils sont mis à jour partout : les 18
pages, les boutons d'appel, le pied de page, le sitemap, le badge « Ouvert » et
les données structurées Google.

---

## État technique

Mesuré sur la page d'accueil, en émulation mobile (Lighthouse 12) :

| | Français | Arabe |
| --- | --- | --- |
| Performance | 96 | 92 |
| Accessibilité | 100 | 100 |
| Bonnes pratiques | 100 | 100 |
| SEO | 100 | 100 |

- **CLS 0** — la mise en page ne bouge pas pendant le chargement.
- **0 violation axe-core** (WCAG 2.1/2.2 AA + bonnes pratiques), sur les deux langues et deux tailles d'écran.
- **Poids** : CSS 28 Ko, JS 5,5 Ko, polices 80 Ko. Aucun script tiers au chargement.
- **Vie privée** : Google Maps n'est contacté **que** si le visiteur clique sur le plan.
- Le site reste lisible et navigable **sans JavaScript**.
- `prefers-reduced-motion` respecté : les animations deviennent instantanées, jamais invisibles.

`npm run check` revérifie tout cela (canoniques, hreflang, données structurées,
liens morts, textes alternatifs, longueurs de titres) avant chaque mise en ligne.

---

## Deux documents de référence

- **[PRODUCT.md](PRODUCT.md)** — à qui s'adresse le site, ce qu'il doit provoquer, ce qu'il ne doit surtout pas ressembler.
- **[DESIGN.md](DESIGN.md)** — le système visuel : couleurs (avec les contrastes vérifiés), typographie, motion, composants.

À lire avant toute modification importante : ils expliquent *pourquoi* le site
est fait comme ça.

---

## Crédits

- Photo de Tétouan : Ideophagous, Wikimedia Commons, CC BY-SA 4.0.
- Typographie : [Readex Pro](https://fonts.google.com/specimen/Readex+Pro), SIL Open Font License, auto-hébergée.
