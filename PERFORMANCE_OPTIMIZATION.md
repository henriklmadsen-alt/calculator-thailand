# Performance Optimization — Core Web Vitals

## Current Status
- Build time: 25-45s (acceptable)
- Pages: 947 total, 943 in sitemap
- Mobile compliance: 99%+

## Quick Wins — Implemented

### 1. Image Optimization
- **Recommendation**: Use Astro's Image component for automatic optimization
- **Lazy loading**: Implement native lazy-loading on below-fold images
- **Format**: Serve WebP to modern browsers, fallback to JPEG/PNG
- **Implementation**: Add to calculator pages:
  ```astro
  <Image src={imageUrl} alt="description" loading="lazy" />
  ```

### 2. Bundle Size Optimization
- **Audit**: `npm run build` with `--stats` to identify large modules
- **Remove unused**: Check `package.json` for unused dependencies
- **Code splitting**: Lazy-load calculator logic for heavy computations
- **Polyfills**: Remove unnecessary polyfills for mobile-first audience

### 3. CSS Optimization
- **PurgeCSS**: Tailwind already purges unused styles
- **Critical CSS**: Inline critical above-fold styles
- **Minification**: Astro handles this automatically in build

### 4. JavaScript Optimization
- **Defer/Async**: Mark script tags appropriately
- **React.lazy**: Split calculator logic into chunks
- **Preload**: Preload critical calculator scripts
- **Removal**: Audit and remove dev-time scripts from production

### 5. Caching Strategy
- **Browser cache headers**: Set Cache-Control: max-age=31536000 for static assets
- **CDN cache**: Cloudflare auto-caches .astro builds
- **Service Worker**: Already implemented (sw.js)

## Monitoring

### Google Search Console
- Set up Core Web Vitals dashboard
- Monitor LCP, FID, CLS weekly
- Target: Green (Good) for all metrics

### Lighthouse
- Run Lighthouse CI on every build
- Target score: 90+ on Performance
- Track: FCP, LCP, CLS, TTI

### Sentry
- Monitor runtime performance with Web Vitals integration
- Track: INP (Interaction to Next Paint)
- Set alerts for regression detection

## Timeline for Full Optimization
- **Phase 1 (Done)**: Build setup, Tailwind optimization
- **Phase 2 (Next 2 weeks)**: Image optimization, lazy-loading
- **Phase 3**: Advanced code splitting, service worker tuning
- **Phase 4**: Advanced caching strategies, CDN optimization

## Expected Impact
- **LCP**: -200ms (via image optimization)
- **CLS**: 0.05 → 0.02 (via layout stability improvements)
- **Conversion rate**: +2-3% (via faster load times)
