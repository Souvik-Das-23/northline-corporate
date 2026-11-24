# NORTHLINE — Strategic Corporate Advisory

An ultra-premium corporate website built in pure semantic HTML5, CSS3, and Vanilla JavaScript, adhering strictly to the **Swiss Minimalist** design philosophy. Designed for executive advisory, private capital, digital transformation, and organizational architecture firms.

---

## Architecture & Design Direction

- **Design Ethos**: Swiss Modernism with high-end editorial clarity, precise modular grids, subtle architectural visuals, and restrained contrast.
- **Color Grading**:
  - **Light Mode**: Warm Porcelain (`#F5F4F0`), Soft Ivory (`#EBE9E2`), Deep Charcoal (`#20211F`), Deep Stone (`#686762`), Muted Champagne Gold (`#AD9568`), Warm Grey borders (`#DEDCD4`).
  - **Dark Mode**: Rich Obsidian (`#151615`), Deep Graphite (`#20211F`), Warm White (`#F2F0E9`), Muted Silver (`#A8A8A0`), Champagne Gold (`#C5AD7D`), Subtle borders (`#34342F`).
- **Typography**: Space Grotesk (Editorial Headlines & Technical Labels) + DM Sans (Precision Body Copy).
- **Interactive Motion**: Interactive isometric 3D architectural canvas, cursor-following magnetic buttons, staggered load sequences, and smooth theme toggling with zero flash.
- **Zero Dependencies**: Pure native browser technologies — no heavy runtime libraries, no client frameworks, no build-step bottlenecks.

---

## Directory Structure

```plaintext
northline-corporate/
├── assets/
│   └── og-image.svg          # 1200x630 Open Graph & Twitter Social Preview Card
├── css/
│   └── styles.css            # Complete design system, responsive styles & theme tokens
├── js/
│   └── script.js             # Interactive canvas, navigation, theme & form logic
├── 404.html                  # Branded Swiss Minimalist 404 error page
├── favicon.svg               # SVG favicon with dark/light mode support
├── index.html                # Semantic HTML5 homepage with JSON-LD metadata
├── netlify.toml              # Netlify headers, caching policy, and 404 routing
├── robots.txt                # Search engine crawler permissions & sitemap link
├── sitemap.xml               # Standard search engine index sitemap
├── vercel.json               # Vercel security headers and asset caching rules
└── README.md                 # Project documentation and deployment guide
```

---

## Production Features

### 1. SEO & Structured Data
- **Metadata**: Comprehensive title, meta description, author, robots directive, and canonical URL (`https://northline.co/`).
- **Social Sharing**: Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Card (`summary_large_image`) tags with dedicated high-res vector preview (`assets/og-image.svg`).
- **Schema.org**: Valid JSON-LD graph linking `Organization`, `ProfessionalService`, and `WebSite` schemas.
- **Search Indices**: Standard-compliant `robots.txt` and `sitemap.xml`.

### 2. Performance & Core Web Vitals
- **Zero Layout Shifts (CLS 0.0)**: Fixed aspect ratios, font preloading (`preconnect` + `swap`), and container sizing prevent sudden reflows.
- **High Frame Rates**: Animations use CSS hardware-accelerated transforms and opacity. Canvas animation loop yields gracefully on low-end devices and respects user battery/refresh rate.
- **Asset Caching**: `vercel.json` and `netlify.toml` apply immutable caching (`max-age=31536000, immutable`) for static assets and SVGs.

### 3. Accessibility (WCAG 2.1 AA)
- **High Contrast Ratios**: Text elements exceed the 4.5:1 WCAG AA contrast ratio across both light and dark themes.
- **Visible Focus States**: Dedicated high-contrast `:focus-visible` styling for all interactive elements.
- **Assistive Technology**: Screen-reader live regions (`aria-live="polite"`), `aria-expanded` attributes for mobile navigation, and clear descriptive text for all controls.
- **Reduced Motion**: Full support for `prefers-reduced-motion: reduce`, disabling smooth scrolls, rotation transforms, and canvas animation loops.

### 4. Enterprise Contact System
- **Fields**: Full Name, Business Email, Organization, Advisory Focus, and Project Scope.
- **Real-Time Client Validation**: Interactive regex testing with accessible error messaging.
- **Spam Defense**: Honeypot trap field (`_gotcha`) ignores automated bot submissions silently.
- **Backend Ready**: Ready for Formspree (`action="https://formspree.io/f/YOUR_FORM_ID"`), Netlify Forms (`data-netlify="true"`), or custom API gateways.
- **Honest Demo Handling**: When unconfigured, it transparently validates inputs and provides a pre-formatted direct `mailto:` fallback rather than simulating a fake server response.

---

## Local Development

Because NORTHLINE uses native web standards, you can run it locally with any static web server:

### Option A: Node.js (npx serve)
```bash
npx serve .
```

### Option B: Python 3
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Option C: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), click **"Add New Project"** and import `northline-corporate`.
3. Keep the default settings (Framework Preset: **Other**; Root Directory: `./`).
4. Click **Deploy**. The repository's `vercel.json` will automatically configure security headers and cache policies.

### Deploy to Netlify
1. In the [Netlify Dashboard](https://app.netlify.com/), click **"Add new site"** > **"Import an existing project"**.
2. Connect your GitHub repository.
3. Build command: leave empty; Publish directory: `.`.
4. Click **Deploy site**. `netlify.toml` handles routing, headers, and form processing.

### Connecting the Contact Form
1. **Formspree**: Create a form on [formspree.io](https://formspree.io) and replace `YOUR_FORM_ID` in `index.html` line 254:
   ```html
   <form id="contactForm" class="contact__form" action="https://formspree.io/f/YOUR_ACTUAL_ID" method="POST">
   ```
2. **Netlify Forms**: Netlify detects `data-netlify="true"` automatically on deployment. Submissions will appear in your Netlify Site Dashboard under the **Forms** tab.

---

## License

Private corporate property of **NORTHLINE**. All rights reserved.
