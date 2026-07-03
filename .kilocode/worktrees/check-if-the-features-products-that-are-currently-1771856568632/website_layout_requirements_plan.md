# Saudi Horizon Website Layout Requirements & Implementation Plan

Based on the analysis of the current project structure and components, we've identified several missing aspects that are required to achieve a cohesive, premium, and comprehensive design across the main pages.

## I. Missing Aspects & Layout Requirements

1.  **Unified Global Footer**: Currently, the premium `CTAFooterSection` is only implemented on the homepage. Sub-pages like About, Contact, and Products either have a basic footer or no footer at all.
2.  **Theme Standardization**: Several sub-pages use ad-hoc background colors (`bg-gray-900`, `bg-background`) and accent colors (`text-yellow-500`, `bg-blue-600`) instead of the established premium design tokens (`bg-navy`, `bg-charcoal`, `var(--color-gold)`).
3.  **Homepage Content Gaps**:
    *   **Process Section**: The `ProcessSection` component is built but not featured on the homepage.
    *   **Stats Section**: A standalone `StatsSection` with count-up animations is available but unused.
    *   **Featured Machinery**: A specialized component for heavy equipment is built but not shown.
4.  **Dynamic Banner Support**: The Admin panel manages "Banners" with positions like `homepage`, but the current `HeroSection` is static and does not fetch or display these banners.
5.  **Layout Consistency**: Standardizing container widths (`container-premium`), spacing (`section-padding`), and transitions across all main pages.

## II. Implementation Tasks

### 1. Global Layout Infrastructure
- [ ] Create a global `Footer` component by refactoring `CTAFooterSection.tsx`.
- [ ] Integrate the global `Footer` into `src/components/Layout.tsx`.
- [ ] Ensure `src/components/Layout.tsx` provides the standard background and typography settings for all non-admin pages.

### 2. Homepage Enhancement
- [ ] **Dynamic Hero**: Update `HeroSection.tsx` to fetch active banners from `/api/admin/banners` and implement a carousel if multiple active banners exist.
- [ ] **Section Integration**: Add `StatsSection`, `ProcessSection`, and `FeaturedMachinery` to `src/app/page.tsx` in a logical flow:
    *   Hero -> Brand Strip -> **Stats** -> Features -> Categories -> **Machinery** -> **Process** -> Products -> Story -> CTA -> Articles -> FAQ.
- [ ] **Spacing**: Apply `section-divider` between all primary homepage sections.

### 3. Sub-page Standardization
- [ ] **About Page**: Update `src/app/about/page.tsx` to use `bg-navy`, `container-premium`, and standard heading styles. Remove local stats in favor of the global `StatsSection` or shared components.
- [ ] **Contact Page**: Update `src/app/contact/page.tsx` with premium theme colors and add the global footer.
- [ ] **Products Page**: Ensure the sidebar and grid transitions match the homepage aesthetic.
- [ ] **Cart & Checkout**: Standardize the visual design to match the "Premium Industrial" theme (dark mode, gold accents).

### 4. Admin Feature Parity
- [ ] **SEO Integration**: Ensure global metadata in `layout.tsx` or individual pages pulls from the settings managed in the Admin panel.
- [ ] **Banners**: Verify that active banners created in Admin appear correctly on the frontend.

## III. Handoff & Completion Criteria
- [ ] All main pages (Home, Products, About, Contact, Help) have a consistent look and feel with the same Header and Footer.
- [ ] No ad-hoc Tailwind colors (e.g., `blue-600`) are used in B2C/B2B surfaces; all use design tokens.
- [ ] The homepage is feature-complete with all available premium sections.
- [ ] Responsive design is verified across all sections.
