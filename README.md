# Petrocell Group Limited

Production corporate holding-company website for Petrocell Group Limited, headquartered in Port Harcourt, Rivers State, Nigeria.

## Technology

- Vite, semantic HTML, modular CSS, and vanilla JavaScript
- GSAP and ScrollTrigger for deliberate reveal animation
- Lenis for smooth scrolling
- Lucide icons
- Netlify Forms for Group enquiries
- Vitest and ESLint for automated checks

## Local Development

```bash
npm install
npm run dev
```

Before publishing changes:

```bash
npm run lint
npm test
npm run build
```

## Content Maintenance

Page content and subsidiary links live in `index.html`. Global presentation lives in `src/styles.css`; navigation, animation, and form interactions live in `src/main.js`. Form validation and Netlify encoding are isolated in `src/form.js`.

The Group email is currently `group@petrocellgroup.com`. Search for that address across `index.html` and `src/main.js` when changing it.

### Subsidiary Links

- Petrocell Oil and Gas uses the verified production URL `https://petrocell-oil-and-gas-limited.netlify.app/`.
- Petrocell Connect currently routes enquiries to the Group contact form. Once its official site is live, replace every `data-connect-link` destination with the verified HTTPS URL, add `target="_blank" rel="noopener"`, and update the routing test.

## Assets

- Approved originals: `src/assets/source/`
- Production logos: `public/assets/logo/`
- Leadership portrait: `public/assets/images/chimezie-ifeanyi-samuel.webp`
- Social image: `public/assets/social/petrocell-group-og.jpg`

The repository includes `scripts/process_assets.py` for reproducibly generating production derivatives. It requires Pillow and NumPy. Preserve originals unchanged for brand traceability.

Future photography must be authentic, optimized to WebP or AVIF, given intrinsic dimensions and descriptive alternative text, and added without creating empty placeholder areas.

## Netlify Deployment

The repository includes `netlify.toml` and requires no environment variables.

1. Import `Csamuels1/Petrocell-Group-Limited` into Netlify.
2. Deploy the `main` branch with `npm run build` and the `dist` publish directory.
3. Confirm Netlify detects the `petrocell-group-enquiry` form.
4. Configure form notification recipients in the Netlify dashboard.
5. If the production domain changes, update the canonical URL, Open Graph URL, `public/robots.txt`, and `public/sitemap.xml`.

## cPanel Export

Run `npm run build`, then upload the contents of `dist/` to `public_html`. Static content will work normally, but Netlify Forms will not; connect the form to an approved server-side mail handler before using cPanel hosting.

## Accessibility And Performance

- All animation honors `prefers-reduced-motion`.
- Navigation, dropdown, CTAs, and forms support keyboard operation and visible focus treatment.
- Responsive layouts target 375px, 768px, and 1440px.
- Generated output, dependencies, local settings, and reports are excluded from Git.
