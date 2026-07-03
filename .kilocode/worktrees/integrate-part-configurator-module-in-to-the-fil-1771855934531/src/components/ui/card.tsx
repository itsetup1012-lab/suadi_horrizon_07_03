import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card Component following vercel-composition-patterns skill
 * - Compound component pattern
 * - Accessible with proper focus states
 * - Supports hover and focus-visible states
 */

/* =========================================
   CARD ROOT
   ========================================= */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   */
  variant?: "default" | "bordered" | "elevated" | "glass";
  /**
   * Hover effect
   */
  hover?: boolean;
  /**
   * Clickable card
   */
  clickable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, clickable = false, ...props }, ref) => {
    const baseStyles = "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200";

    const variants = {
      default: "border-border",
      bordered: "border-2 border-border",
      elevated: "border-none shadow-lg",
      glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/20",
    };

    const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";
    const clickableStyles = clickable ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, clickableStyles, className)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

/* =========================================
   CARD HEADER
   ========================================= */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Center align content
   */
  center?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, center = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", center && "text-center items-center", className)}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

/* =========================================
   CARD TITLE
   ========================================= */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

/* =========================================
   CARD DESCRIPTION
   ========================================= */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);

CardDescription.displayName = "CardDescription";

/* =========================================
   CARD CONTENT
   ========================================= */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

CardContent.displayName = "CardContent";

/* =========================================
   CARD FOOTER
   ========================================= */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Center align footer content
   */
  center?: boolean;
  /**
   * Stack vertically on mobile
   */
  stacked?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, center = false, stacked = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        center && "justify-center",
        stacked && "flex-col sm:flex-row sm:justify-end gap-2",
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";

/* =========================================
   CARD ACTION (for clickable cards)
   ========================================= */
export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Position action in corner
   */
  corner?: boolean;
}

const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, corner = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute",
        corner && "top-4 right-4",
        className
      )}
      {...props}
    />
  )
);

CardAction.displayName = "CardAction";

/* =========================================
   CARD MEDIA (image/video wrapper)
   ========================================= */
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Aspect ratio for media
   */
  aspect?: "video" | "square" | "wide" | "golden";
}

const aspectRatios = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  golden: "aspect-[1.618/1]",
};

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ className, aspect = "video", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-hidden", aspectRatios[aspect], className)}
      {...props}
    />
  )
);

CardMedia.displayName = "CardMedia";

/* =========================================
   CARD OVERLAY (for hover effects)
   ========================================= */
export interface CardOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Show overlay on hover only
   */
  hover?: boolean;
}

const CardOverlay = React.forwardRef<HTMLDivElement, CardOverlayProps>(
  ({ className, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
        hover && "opacity-0 hover:opacity-100 transition-opacity duration-300",
        className
      )}
      {...props}
    />
  )
);

CardOverlay.displayName = "CardOverlay";

/* =========================================
   COMPOUND CARD EXAMPLE USAGE
   ========================================= */

/*
// Basic Card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Hoverable Card with Media
<Card hover>
  <CardMedia aspect="video">
    <img src="..." alt="..." />
  </CardMedia>
  <CardHeader>
    <CardTitle>Featured Item</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Description</p>
  </CardContent>
</Card>

// Clickable Card
<Card clickable variant="bordered">
  <CardAction corner>
    <Button variant="ghost" size="icon">
      <HeartIcon />
    </Button>
  </CardAction>
  <CardHeader>
    <CardTitle>Clickable Item</CardTitle>
  </CardHeader>
</Card>

// Glass Card
<Card variant="glass">
  <CardContent>
    <p>Glass morphism effect</p>
  </CardContent>
</Card>
*/

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardMedia,
  CardOverlay,
};
