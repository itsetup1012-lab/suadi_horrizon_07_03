# Modern CSS Techniques Reference

## OKLCH Color Space Implementation

### Basic Syntax
```css
.oklch-color {
  color: oklch(70% 0.21 280); /* lightness chroma hue */
}
```

### Creating Color Systems with OKLCH
```css
:root {
  --foundation-lightness: 0.5;
  --foundation-chroma: 0.15;
  --foundation-hue: 240;
  
  /* Derived colors using calc() */
  --lighter: oklch(calc(var(--foundation-lightness) + 0.2) var(--foundation-chroma) var(--foundation-hue));
  --darker: oklch(calc(var(--foundation-lightness) - 0.2) var(--foundation-chroma) var(--foundation-hue));
  --more-saturated: oklch(var(--foundation-lightness) calc(var(--foundation-chroma) * 1.5) var(--foundation-hue));
  --less-saturated: oklch(var(--foundation-lightness) calc(var(--foundation-chroma) * 0.5) var(--foundation-hue));
  --rotated-hue: oklch(var(--foundation-lightness) var(--foundation-chroma) calc(var(--foundation-hue) + 60));
}
```

## CSS Custom Properties with @property

### Registration for Animation
```css
@property --theme-primary-lightness {
  syntax: "<number>";
  inherits: true;
  initial-value: 0.5;
}

@property --theme-primary-chroma {
  syntax: "<number>";
  inherits: true;
  initial-value: 0.2;
}

@property --theme-primary-hue {
  syntax: "<number>";
  inherits: true;
  initial-value: 240;
}

.animated-theme {
  background: oklch(
    var(--theme-primary-lightness) 
    var(--theme-primary-chroma) 
    var(--theme-primary-hue)
  );
  
  transition: 
    --theme-primary-lightness 0.3s ease,
    --theme-primary-chroma 0.3s ease,
    --theme-primary-hue 0.3s ease;
}
```

## Blend Modes for Dynamic Coloring

### Using mix-blend-mode
```css
.overlay-container {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: color; /* Preserves luminance while applying color */
  background: oklch(0.5 0.15 40); /* Yellow tint */
}
```

## SVG with Dynamic Colors

### Connecting SVG to CSS Custom Properties
```html
<svg viewBox="0 0 100 100">
  <defs>
    <linearGradient id="dynamic-gradient">
      <stop offset="0%" stop-color="oklch(var(--accent-lightness) var(--accent-chroma) var(--accent-hue))" />
      <stop offset="100%" stop-color="oklch(calc(var(--accent-lightness) - 0.1) var(--accent-chroma) var(--accent-hue))" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="40" fill="url(#dynamic-gradient)" />
</svg>
```

## Advanced Theming Techniques

### Theme Switching with CSS Variables
```css
[data-theme="dark"] {
  --foundation-lightness: 0.3;
  --foundation-chroma: 0.15;
  --foundation-hue: 240;
}

[data-theme="light"] {
  --foundation-lightness: 0.8;
  --foundation-chroma: 0.15;
  --foundation-hue: 240;
}

[data-theme="contrast"] {
  --foundation-lightness: 0.5;
  --foundation-chroma: 0.25;
  --foundation-hue: 240;
}
```

## Color Contrast Calculations

### Automatic Contrast Adjustments
```css
.card {
  --base-lightness: 0.95;
  --text-lightness: 0.1;
  
  /* For light backgrounds, ensure sufficient contrast */
  background: oklch(
    clamp(0.8, var(--base-lightness), 1) 
    0.01 
    0
  );
  
  color: oklch(
    clamp(0, var(--text-lightness), 0.2) 
    0.01 
    0
  );
}
```

## Animation with Color Transitions

### Smooth Color Transitions
```css
.interactive-element {
  --current-lightness: 0.5;
  --current-chroma: 0.2;
  --current-hue: 240;
  
  background: oklch(
    var(--current-lightness) 
    var(--current-chroma) 
    var(--current-hue)
  );
  
  /* Note: Color transitions work best with custom properties */
  transition: 
    --current-lightness 0.3s ease,
    --current-chroma 0.3s ease,
    --current-hue 0.3s ease;
}

.interactive-element:hover {
  --current-lightness: 0.7;
  --current-chroma: 0.3;
  --current-hue: 280;
}
```