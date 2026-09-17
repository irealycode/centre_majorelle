# Centre Dentaire Majorelle

Static French and Arabic (RTL) website for Centre Dentaire Majorelle, Tétouan.
It is ready to publish through GitHub Pages with **no build step and no GitHub
Actions**.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select branch `main`, then select the `/docs` folder, and save.

GitHub will publish the files in `docs/`. Every page, asset and internal link
is relative, so it works at both `username.github.io/repository/` and a custom
domain. The `.nojekyll` file is included so GitHub serves all files unchanged.

## Edit the published site

The live website is entirely in `docs/`:

```
docs/index.html                  French home page
docs/ar/index.html               Arabic home page
docs/*.html                      French service and contact pages
docs/ar/*.html                   Arabic service and contact pages
docs/assets/css/site.css         Styles
docs/assets/js/site.js           Mobile menu, opening badge and map behaviour
docs/assets/img/                 Optimized local images
```

There is no required Node, npm, database, framework, build server or action.
For a local preview, run `node tools/serve.mjs` and open
`http://localhost:4321/`.

## Before publishing

The site currently contains a few clinic facts that need confirmation: email,
street number, opening hours, Google Business Profile, social links, the
doctor's Arabic name/title, and several clinical statements. Search the source
files for `TODO` before launch.

Also replace the placeholder photography for the dentist, treatment room and
sterilization room with genuine clinic photos.

## SEO domain setup

The static pages preserve the original canonical URLs and structured data for
`centredentairemajorelle.ma`. If the final public domain differs, replace that
domain in the HTML files and `docs/sitemap.xml` before submitting the sitemap
to Google Search Console. Do not leave a canonical URL pointing to a domain
you do not control.

## Legacy source files

The `src/`, `build.mjs`, and `tools/` files are retained as the original
content-generation source and maintenance tools. GitHub Pages does not use
them; it only serves `docs/`.
