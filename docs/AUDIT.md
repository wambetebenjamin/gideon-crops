# STEP 1 audit, uploaded template before any code was written

Template zip: `alazea-gh-pages.zip` (7.5 MB, 139 files). The theme is **Alazea**, a Colorlib
"Gardening and Landscaping" static HTML template: Bootstrap 4, ClassyNav, Owl Carousel,
Font Awesome 4.7, Elegant Icons, SASS partials, a jQuery `active.js` and ten flat HTML pages.
There is no JavaScript framework, no package.json, no API route, no Next.js config and no
component system of any kind, so the site was rebuilt as a Next.js 16 app that keeps the
template markup, class names, stylesheet order and typeface exactly as they ship.

## 1. Full file tree of the zip

```text
alazea-gh-pages/about.html
alazea-gh-pages/blog.html
alazea-gh-pages/cart.html
alazea-gh-pages/checkout.html
alazea-gh-pages/contact.html
alazea-gh-pages/css
alazea-gh-pages/css/animate.css
alazea-gh-pages/css/bootstrap.min.css
alazea-gh-pages/css/classy-nav.css
alazea-gh-pages/css/elegant-icon.css
alazea-gh-pages/css/font-awesome.min.css
alazea-gh-pages/css/magnific-popup.css
alazea-gh-pages/css/owl.carousel.min.css
alazea-gh-pages/fonts
alazea-gh-pages/fonts/ElegantIcons.eot
alazea-gh-pages/fonts/ElegantIcons.svg
alazea-gh-pages/fonts/ElegantIcons.ttf
alazea-gh-pages/fonts/ElegantIcons.woff
alazea-gh-pages/fonts/FontAwesome.otf
alazea-gh-pages/fonts/classy.eot
alazea-gh-pages/fonts/classy.svg
alazea-gh-pages/fonts/classy.ttf
alazea-gh-pages/fonts/classy.woff
alazea-gh-pages/fonts/fontawesome-webfont.eot
alazea-gh-pages/fonts/fontawesome-webfont.svg
alazea-gh-pages/fonts/fontawesome-webfont.ttf
alazea-gh-pages/fonts/fontawesome-webfont.woff
alazea-gh-pages/fonts/fontawesome-webfont.woff2
alazea-gh-pages/img
alazea-gh-pages/img/bg-img
alazea-gh-pages/img/bg-img/1.jpg
alazea-gh-pages/img/bg-img/10.jpg
alazea-gh-pages/img/bg-img/11.jpg
alazea-gh-pages/img/bg-img/12.jpg
alazea-gh-pages/img/bg-img/13.jpg
alazea-gh-pages/img/bg-img/14.jpg
alazea-gh-pages/img/bg-img/15.jpg
alazea-gh-pages/img/bg-img/16.jpg
alazea-gh-pages/img/bg-img/17.jpg
alazea-gh-pages/img/bg-img/18.jpg
alazea-gh-pages/img/bg-img/19.jpg
alazea-gh-pages/img/bg-img/2.jpg
alazea-gh-pages/img/bg-img/20.jpg
alazea-gh-pages/img/bg-img/21.jpg
alazea-gh-pages/img/bg-img/22.jpg
alazea-gh-pages/img/bg-img/23.jpg
alazea-gh-pages/img/bg-img/24.jpg
alazea-gh-pages/img/bg-img/25.jpg
alazea-gh-pages/img/bg-img/26.jpg
alazea-gh-pages/img/bg-img/27.jpg
alazea-gh-pages/img/bg-img/28.jpg
alazea-gh-pages/img/bg-img/29.jpg
alazea-gh-pages/img/bg-img/3.jpg
alazea-gh-pages/img/bg-img/30.jpg
alazea-gh-pages/img/bg-img/31.jpg
alazea-gh-pages/img/bg-img/32.jpg
alazea-gh-pages/img/bg-img/33.jpg
alazea-gh-pages/img/bg-img/34.jpg
alazea-gh-pages/img/bg-img/35.jpg
alazea-gh-pages/img/bg-img/36.jpg
alazea-gh-pages/img/bg-img/37.jpg
alazea-gh-pages/img/bg-img/38.jpg
alazea-gh-pages/img/bg-img/39.jpg
alazea-gh-pages/img/bg-img/4.jpg
alazea-gh-pages/img/bg-img/40.png
alazea-gh-pages/img/bg-img/41.png
alazea-gh-pages/img/bg-img/42.png
alazea-gh-pages/img/bg-img/43.png
alazea-gh-pages/img/bg-img/44.png
alazea-gh-pages/img/bg-img/45.png
alazea-gh-pages/img/bg-img/46.png
alazea-gh-pages/img/bg-img/47.png
alazea-gh-pages/img/bg-img/48.png
alazea-gh-pages/img/bg-img/49.jpg
alazea-gh-pages/img/bg-img/5.jpg
alazea-gh-pages/img/bg-img/6.jpg
alazea-gh-pages/img/bg-img/7.jpg
alazea-gh-pages/img/bg-img/8.jpg
alazea-gh-pages/img/bg-img/9.jpg
alazea-gh-pages/img/bg-img/cool-facts.png
alazea-gh-pages/img/bg-img/subscribe.png
alazea-gh-pages/img/bg-img/team1.png
alazea-gh-pages/img/bg-img/team2.png
alazea-gh-pages/img/bg-img/team3.png
alazea-gh-pages/img/bg-img/team4.png
alazea-gh-pages/img/core-img
alazea-gh-pages/img/core-img/b1.png
alazea-gh-pages/img/core-img/b2.png
alazea-gh-pages/img/core-img/b3.png
alazea-gh-pages/img/core-img/b4.png
alazea-gh-pages/img/core-img/cf1.png
alazea-gh-pages/img/core-img/cf2.png
alazea-gh-pages/img/core-img/cf3.png
alazea-gh-pages/img/core-img/cf4.png
alazea-gh-pages/img/core-img/favicon.ico
alazea-gh-pages/img/core-img/leaf.png
alazea-gh-pages/img/core-img/logo.png
alazea-gh-pages/img/core-img/pot.png
alazea-gh-pages/img/core-img/s1.png
alazea-gh-pages/img/core-img/s2.png
alazea-gh-pages/img/core-img/s3.png
alazea-gh-pages/index.html
alazea-gh-pages/js
alazea-gh-pages/js/active.js
alazea-gh-pages/js/bootstrap
alazea-gh-pages/js/bootstrap/bootstrap.min.js
alazea-gh-pages/js/bootstrap/popper.min.js
alazea-gh-pages/js/jquery
alazea-gh-pages/js/jquery/jquery-2.2.4.min.js
alazea-gh-pages/js/plugins
alazea-gh-pages/js/plugins/plugins.js
alazea-gh-pages/portfolio.html
alazea-gh-pages/scss
alazea-gh-pages/scss/_fonts.scss
alazea-gh-pages/scss/_mixin.scss
alazea-gh-pages/scss/_responsive.scss
alazea-gh-pages/scss/_theme_color.scss
alazea-gh-pages/scss/style.scss
alazea-gh-pages/shop-details.html
alazea-gh-pages/shop.html
alazea-gh-pages/single-portfolio.html
alazea-gh-pages/single-post.html
alazea-gh-pages/style.css
alazea-gh-pages/style.css.map
alazea-gh-pages/.sass-cache/ (5 hash folders, 31 compiled .scssc cache files, excluded from the rebuild)
```

## 2. CSS custom properties found

The template itself declares **no** `--` custom properties. The only custom properties in the
zip come from the bundled Bootstrap 4 stylesheet:

| Property | Value |
| --- | --- |
| `--blue` | `#007bff` |
| `--indigo` | `#6610f2` |
| `--purple` | `#6f42c1` |
| `--pink` | `#e83e8c` |
| `--red` | `#dc3545` |
| `--orange` | `#fd7e14` |
| `--yellow` | `#ffc107` |
| `--green` | `#28a745` |
| `--teal` | `#20c997` |
| `--cyan` | `#17a2b8` |
| `--white` | `#fff` |
| `--gray` | `#6c757d` |
| `--gray-dark` | `#343a40` |
| `--primary` | `#007bff` |
| `--secondary` | `#6c757d` |
| `--success` | `#28a745` |
| `--info` | `#17a2b8` |
| `--warning` | `#ffc107` |
| `--danger` | `#dc3545` |
| `--light` | `#f8f9fa` |
| `--dark` | `#343a40` |
| `--breakpoint-xs` | `0` |
| `--breakpoint-sm` | `576px` |
| `--breakpoint-md` | `768px` |
| `--breakpoint-lg` | `992px` |
| `--breakpoint-xl` | `1200px` |
| `--font-family-sans-serif` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` |
| `--font-family-monospace` | `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` |

The template colour system lives in SASS variables (`scss/_theme_color.scss`), reproduced
verbatim as CSS custom properties in `app/globals.css`:

| Property | Value |
| --- | --- |
| `--pri-color` | `#70c745` |
| `--heading-color` | `#303030` |
| `--text-color` | `#707070` |
| `--bg-gray` | `#f2f4f5` |
| `--border-color` | `#ebebeb` |
| `--dark-color` | `#111111` |
| `--footer-color` | `#2d2d2d` |
| `--secondary-color` | `#b7b7b7` |
| `--white-color` | `#ffffff` |

## 3. Every @font-face rule found

| Family | src | weight | style | File |
| --- | --- | --- | --- | --- |
| `FontAwesome` | `../fonts/fontawesome-webfont.eot?v=4.7.0`, `.eot?#iefix&v=4.7.0` (embedded-opentype), `.woff2?v=4.7.0` (woff2), `.woff?v=4.7.0` (woff), `.ttf?v=4.7.0` (truetype), `.svg?v=4.7.0#fontawesomeregular` (svg) | normal | normal | `css/font-awesome.min.css` |
| `ElegantIcons` | `../fonts/ElegantIcons.eot`, `.eot?#iefix` (embedded-opentype), `.woff` (woff), `.ttf` (truetype), `.svg#ElegantIcons` (svg) | normal | normal | `css/elegant-icon.css` |
| `classyfonts` | `../fonts/classy.eot?fftrrv`, `.eot?fftrrv#iefix` (embedded-opentype), `.ttf?fftrrv` (truetype), `.woff?fftrrv` (woff), `.svg?fftrrv#classyfonts` (svg) | normal | normal | `css/classy-nav.css` |

The body typeface is not a `@font-face` rule in the zip. It is a Google Fonts import in
`style.css` line 10:

```css
@import url("https://fonts.googleapis.com/css?family=Dosis:200,300,400,500,600,700,800");
```

and is used as `font-family: "Dosis", sans-serif`. Dosis is kept exactly, with the same seven
weights (200, 300, 400, 500, 600, 700, 800), self hosted so the offline scanner does not depend on Google
Fonts. The `.woff` and `.woff2` files are copied from the `@fontsource/dosis` distribution into
`app/styles/fonts/`; the package itself is not a runtime dependency. The CSS import was replaced with real
`@font-face` rules (same family name, same weights, same `normal` style) in `app/styles/dosis.css`.
No system or substitute font is used anywhere.

## 4. Existing API route file names

None. The template is a flat set of static HTML files (`index.html`, `about.html`, `blog.html`,
`cart.html`, `checkout.html`, `contact.html`, `portfolio.html`, `shop.html`, `shop-details.html`,
`single-portfolio.html`, `single-post.html`) with no server code, no `api/` directory and no
framework routing.

## 5. Environment variable names referenced in the codebase

None. There is no server code and no build step in the zip.

## 6. Loading screen

Present. Path in the zip: `index.html` lines 20 to 25 (repeated in every page), markup
`.preloader` containing `.preloader-circle` and `.preloader-img` with `img/core-img/leaf.png`.
Styles: `style.css` section `:: 3.5.0 Preloader`, a fixed `#f2f4f5` full screen overlay, an
80px rotating ring with a `#70c745` top border and a white face (`zoom` keyframes), with the
leaf mark centred. Reproduced as `components/Preloader.tsx` with the same markup and classes,
plus the required percentage counter, three second cap and a skip button after one second.

## 7. Cookie consent

Absent. No banner, no `localStorage` key and no consent logic anywhere in the zip. Built from
Step 12 of the brief: fixed bottom full width banner, Accept All and Manage Preferences, a
preference modal with Necessary locked, Functional, Analytics and Marketing toggles, stored
under `gideon_crops_consent`.

## 8. CAPTCHA

Absent. No reCAPTCHA, hCaptcha or Turnstile script, key or endpoint in any HTML file or in
`js/active.js`. Implemented from Step 13: invisible reCAPTCHA v3 on the contact, sign in and
sign up forms, server side verification at `/api/recaptcha/verify`, and a visible reCAPTCHA v2
challenge when the v3 score comes back below 0.5.

## 9. Legal pages

Absent. The zip has no privacy, terms or cookie page and no legal folder. Built at
`/legal/privacy-policy`, `/legal/terms` and `/legal/cookie-policy`.

## 10. 404 and 500

Absent. There is no `404.html` and no `500.html` in the zip. Built as `app/not-found.tsx`
(leaf mark, "This crop page was not found", Back to Home) and `app/error.tsx` plus
`app/global-error.tsx` (Try Again, WhatsApp +254112272061).

## 11. Template assets kept and reused

- `img/core-img/leaf.png` is the logo mark in the zip and is now the Gideon Crops mark, next to
  the wordmark set in Dosis in the template green.
- `img/core-img/logo.png` is the Alazea wordmark. It is not used, because the brand is Gideon
  Crops, but the file is preserved.
- `img/core-img/b1.png` to `b4.png` (benefit icons), `s1.png` to `s3.png` (service icons) and
  `subscribe.png` are preserved as template artwork.
- `img/bg-img/3.jpg` is the footer background and `img/bg-img/24.jpg` is the breadcrumb
  background, both used exactly as in the template.
- Every stylesheet, every icon font and every SASS partial is copied unchanged into
  `app/styles/` and imported in the original order.
