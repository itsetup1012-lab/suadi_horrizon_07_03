import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button Component following design-system-patterns skill
 * - Uses CVA for variant management
 * - Accessible with proper ARIA attributes
 * - Supports loading and disabled states
 * - Minimum 44x44px touch target (WCAG 2.5.5)
 */

const buttonVariants = cva(
  // Base styles - inline-flex for layout, transition for animations
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary industrial orange button
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary hover:shadow-primary-lg",
        // Destructive/error action
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline style
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Secondary action
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost style
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link style
        link: "text-primary underline-offset-4 hover:underline",
        // Industrial style (yellow/orange theme)
        industrial: "bg-gradient-to-r from-primary to-primary-hover text-white hover:from-primary-hover hover:to-primary shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5",
        // Industrial outline
        industrialOutline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
        // Success action
        success: "bg-success text-success-foreground hover:bg-success/90",
        // Warning action
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        // Info action
        info: "bg-info text-info-foreground hover:bg-info/90",
      },
      size: {
        // Default size with 44px min touch target
        default: "h-11 px-4 py-2",
        // Small size
        sm: "h-10 rounded-md px-3",
        // Large size
        lg: "h-12 rounded-md px-8 text-base",
        // Icon-only button (44x44px minimum)
        icon: "h-11 w-11",
        // Icon-only small
        iconSm: "h-9 w-9",
        // Icon-only large
        iconLg: "h-12 w-12",
        // Full width
        full: "w-full h-11",
      },
      loading: {
        true: "cursor-wait",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /**
   * If true, shows loading spinner and disables button
   */
  loading?: boolean;
  /**
   * Icon to show before button text
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to show after button text
   */
  rightIcon?: React.ReactNode;
  /**
   * If true, renders as child component (useful for asChild prop with Link)
   */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            {/* Loading spinner - sr-only for screen readers */}
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Loading</span>
            {/* Keep text for layout stability but visually hidden */}
            <span className="sr-only">{children}</span>
          </>
        ) : leftIcon ? (
          <>
            <span className="mr-2" aria-hidden="true">{leftIcon}</span>
            {children}
          </>
        ) : (
          <>
            {children}
            {rightIcon && (
              <span className="ml-2" aria-hidden="true">{rightIcon}</span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
