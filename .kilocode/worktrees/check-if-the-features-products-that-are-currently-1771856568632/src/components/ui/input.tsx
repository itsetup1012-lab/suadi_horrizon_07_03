import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input Component following accessibility-compliance skill
 * - Proper form labeling (WCAG 3.3.2)
 * - Error identification (WCAG 3.3.1)
 * - Associated labels and descriptions
 * - Minimum touch target (WCAG 2.5.5)
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Helper text below input
   */
  helperText?: string;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Show required indicator
   */
  required?: boolean;
  /**
   * Input size
   */
  inputSize?: "sm" | "md" | "lg";
  /**
   * Left icon component
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon component
   */
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      helperText,
      label,
      required,
      inputSize = "md",
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Generate IDs for accessibility
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Size styles
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4",
      lg: "h-12 px-5 text-lg",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
            <span className="sr-only">
              {required ? " (required)" : " (optional)"}
            </span>
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            id={inputId}
            ref={ref}
            className={cn(
              "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              // Size variant
              sizes[inputSize],
              // Error state
              error && "border-destructive focus-visible:ring-destructive",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-required={required}
            {...props}
          />

          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-destructive font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p
            id={helperId}
            className="mt-1.5 text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/* =========================================
   TEXTAREA COMPONENT
   ========================================= */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Helper text below textarea
   */
  helperText?: string;
  /**
   * Label for the textarea
   */
  label?: string;
  /**
   * Show required indicator
   */
  required?: boolean;
  /**
   * Character counter
   */
  showCounter?: boolean;
  /**
   * Maximum character count
   */
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      helperText,
      label,
      required,
      showCounter,
      maxLength,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
            <span className="sr-only">
              {required ? " (required)" : " (optional)"}
            </span>
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          aria-required={required}
          maxLength={maxLength}
          {...props}
        />

        <div className="flex justify-between mt-1">
          {/* Error or helper message */}
          <div className="flex-1">
            {error ? (
              <p
                id={errorId}
                className="text-sm text-destructive font-medium"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            ) : helperText ? (
              <p
                id={helperId}
                className="text-sm text-muted-foreground"
              >
                {helperText}
              </p>
            ) : null}
          </div>

          {/* Character counter */}
          {showCounter && maxLength && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                typeof value === "string" && value.length >= maxLength
                  ? "text-destructive"
                  : ""
              )}
              aria-live="polite"
            >
              {typeof value === "string" ? value.length : 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
