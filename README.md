# AI Photo Studio

> **Official Website:** [https://pic.amitjoshi.info.np](https://pic.amitjoshi.info.np)  
> **Support Email:** [support@amitjoshi.info.np](mailto:support@amitjoshi.info.np)  
> **WhatsApp Support:** [+977 9746241860](https://wa.me/9779746241860)  
> **Hosting Platform:** GitHub Pages (Static SPA) & Cloud Run (Full-Stack Dev)

AI Photo Studio is a complete web-based photo editor, portrait retouching suite, biometric passport maker, and print sheet layout engine. It combines a full Photoshop-style manual editor with high-performance browser algorithms and optional serverless AI capabilities.

---

## 🌟 Key Features

1. **Full Photoshop-Style Manual Editor (`/editor`)**
   - Multi-layer architecture: image layers, text layers, vector shape layers.
   - Blend modes: Normal, Multiply, Screen, Overlay, Darken, Lighten, Color Dodge, Color Burn, Hard Light, Difference, Luminosity.
   - Non-destructive adjustment panel: Exposure, Brightness, Contrast, Highlights, Shadows, Saturation, Temperature, Tint, Hue, 3×3 Laplacian Sharpening, Gaussian Blur, Vignette, Monochrome, Invert.
   - Interactive tools: Move, Marquee Crop, Freehand Brush, Eraser, Spot Healing, Clone Stamp, Text, Shapes, Eyedropper, Bucket Fill.
   - Non-destructive history stack with unlimited Undo/Redo.
   - Export to PNG (with transparency), JPEG, WebP, and Print PDF.

2. **AI Photo Enhancement & Sharpening (`/enhance`)**
   - Natural, Balanced, and Strong algorithmic presets.
   - Real convolution unsharp masking, dynamic contrast balancing, and shadow recovery.
   - Interactive draggable Before & After split comparison slider.

3. **Portrait Retouch & Blemish Brush (`/retouch`)**
   - Spot healing brush with Gaussian perimeter texture blending.
   - Skin softening brush with selective pore blur.
   - Dodge and Burn brushes for brightening smile/eyes and sculpting shadows.

4. **Head Straightener & Alignment (`/head-straightener`)**
   - Algorithmic facial eye-contrast tilt estimation with recommended correction angle.
   - Fine rotation slider (-20° to +20° in 0.1° increments).
   - Horizontal and vertical biometric grid overlay guides.
   - Auto-crop corners to eliminate transparent rotation wedges.

5. **AI Outfit & Formal Attire Studio (`/outfit-studio`)**
   - Executive Black Suit, Royal Navy Blazer, Charcoal Grey, White Dress Shirt, Academic Gown.
   - Traditional Nepali Daura Suruwal & Coat.
   - Collar height and shoulder width positioning controls.

6. **Photo Background Remover & Replacer (`/background`)**
   - Automatic chroma and luminance subject matting.
   - Transparent PNG cutouts.
   - Solid studio backdrops (Passport White, Light Grey, Consulate Blue).
   - Backdrop bokeh blur depth-of-field simulation.

7. **Passport & Visa Photo Maker (`/passport-photo`)**
   - Official biometric specifications:
     - Nepal MRP & E-Passport (35 × 45 mm, 70–80% face ratio)
     - Nepal Smart Driving License (30 × 35 mm)
     - US Visa & Passport (2 × 2 in / 51 × 51 mm, 600×600 px at 300 DPI)
     - Schengen Visa & EU (35 × 45 mm)
     - India Passport & OCI (35 × 45 mm)
     - UK Passport (35 × 45 mm)
     - Canada Passport (50 × 70 mm)
     - Australia Passport (35 × 45 mm)
   - Crown and chin biometric compliance overlay lines.
   - 1-click export to 300 DPI or direct layout in Print Studio.

8. **Custom Print Studio & Zero-Blank-Page Engine (`/print-studio`)**
   - Exact physical units: Millimetres (mm), Centimetres (cm), Inches (in), Pixels (px).
   - Resolutions: 300 DPI (high-def print), 600 DPI, 150 DPI.
   - Paper sizes: A4 (210 × 297 mm), 4×6 inch, 5×7 inch, US Letter, and Custom dimensions.
   - Automatic grid calculator for maximum copies per sheet.
   - Precise hairline cutting / crop marks.
   - **Critical Bug Fix:** Dedicated `@media print` architecture and deterministic `jsPDF` generation guarantee **ZERO trailing blank pages**.

9. **Persistent Local Projects (`/projects`)**
   - Local-first IndexedDB persistence: layers, thumbnails, adjustments, and edit recipes.
   - Open, duplicate, rename, delete, and clear projects.
   - Browser storage quota indicator.

10. **Technical SEO & Social Cards**
    - Unique canonical URLs (`https://pic.amitjoshi.info.np/*`).
    - OpenGraph and Twitter card metadata for every route.
    - Schema.org `WebApplication` JSON-LD structured data.
    - Valid `sitemap.xml` and `robots.txt`.

11. **Google AdSense Integration Ready**
    - Configurable publisher and ad unit IDs via environment variables.
    - Non-intrusive reserved ad containers (does not obstruct editing canvas).
    - Policy-compliant `public/ads.txt`.

---

## 🚀 GitHub Pages Deployment Instructions

This repository is pre-configured for automated GitHub Pages static hosting:

1. **Push to GitHub**:
   Push the codebase to your `main` branch:
   ```bash
   git add .
   git commit -m "Deploy AI Photo Studio"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: **Settings > Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
   - The included workflow `.github/workflows/deploy.yml` will automatically build the static assets into `./dist` and deploy.

3. **DNS Configuration for `pic.amitjoshi.info.np`**:
   - In your DNS provider for `amitjoshi.info.np`, add a **CNAME** record:
     - **Host / Name:** `pic`
     - **Target / Value:** `<your-github-username>.github.io`
   - In GitHub repository settings: **Pages > Custom domain**, enter `pic.amitjoshi.info.np`.
   - Check **Enforce HTTPS** once DNS propagates.

---

## 🛠️ Environment Variables

Copy `.env.example` to `.env`:

```env
# Optional: Gemini API Key for server-side AI endpoints
GEMINI_API_KEY="your-api-key-here"

# Optional: Google AdSense Publisher & Slot IDs
VITE_ADSENSE_CLIENT_ID="ca-pub-0000000000000000"
VITE_ADSENSE_SLOT_HOMEPAGE="0000000000"
VITE_ADSENSE_SLOT_TOOLS="0000000000"
VITE_ADSENSE_SLOT_SIDEBAR="0000000000"
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run local development server (port 3000)
npm run dev

# Build production static bundle
npm run build

# Type check
npm run lint
```

---

## 📞 Support & Inquiries

- **Email:** [support@amitjoshi.info.np](mailto:support@amitjoshi.info.np)
- **WhatsApp:** [+977 9746241860](https://wa.me/9779746241860)
- **Website:** [https://pic.amitjoshi.info.np](https://pic.amitjoshi.info.np)
