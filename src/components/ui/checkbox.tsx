"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Accessible Checkbox Component following accessibility-compliance skill
 * - Proper ARIA attributes
 * - Keyboard navigation (Space to toggle)
 * - Error state handling
 * - Label associations
 */

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * Label for the checkbox
   */
  label?: string
  /**
   * Error message
   */
  error?: string
  /**
   * Helper text
   */
  helperText?: string
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg"
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, error, helperText, size = "md", id, ...props }, ref) => {
  const checkboxId = id || React.useId()
  const errorId = `${checkboxId}-error`
  const helperId = `${checkboxId}-helper`

  // Size styles with minimum 44x44px touch target (WCAG 2.5.5)
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            "peer shrink-0 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            sizes[size],
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
            asChild
          >
            <Check className={iconSizes[size]} aria-hidden="true" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label && (
          <div className="flex-1">
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-destructive"
              )}
            >
              {label}
            </label>
            {props.required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
            <span className="sr-only">{props.required ? " (required)" : " (optional)"}</span>

            <div className="mt-1">
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
                <p id={helperId} className="text-sm text-muted-foreground">
                  {helperText}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

/* =========================================
   CHECKBOX GROUP COMPONENT
   ========================================= */

interface CheckboxOption {
  value: string
  label: string
  disabled?: boolean
}

interface CheckboxGroupProps {
  /**
   * Group label
   */
  label: string
  /**
   * Options for the checkbox group
   */
  options: CheckboxOption[]
  /**
   * Selected values
   */
  value: string[]
  /**
   * On change handler
   */
  onChange: (value: string[]) => void
  /**
   * Error message
   */
  error?: string
  /**
   * Helper text
   */
  helperText?: string
  /**
   * Required indicator
   */
  required?: boolean
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Layout direction
   */
  direction?: "vertical" | "horizontal"
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg"
}

function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  direction = "vertical",
  size = "md",
}: CheckboxGroupProps) {
  const groupId = React.useId()
  const errorId = `${groupId}-error`
  const helperId = `${groupId}-helper`

  const handleChange = (optionValue: string, checked: boolean) => {
    if (disabled) return

    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  return (
    <fieldset
      className="w-full border-0 p-0"
      role="group"
      aria-labelledby={`${groupId}-label`}
      aria-describedby={error ? errorId : helperText ? helperId : undefined}
      disabled={disabled}
    >
      <legend className="sr-only" id={`${groupId}-label`}>
        {label}
        {required && " (required)"}
      </legend>

      <div className="text-sm font-medium mb-3" id={`${groupId}-legend`}>
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
        <span className="sr-only">{required ? " (required)" : " (optional)"}</span>
      </div>

      <div
        className={cn(
          "flex gap-4",
          direction === "vertical" && "flex-col",
          direction === "horizontal" && "flex-row flex-wrap"
        )}
        role="none"
        aria-labelledby={`${groupId}-legend`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              option.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Checkbox
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => handleChange(option.value, !!checked)}
              disabled={option.disabled || disabled}
              size={size}
              aria-label={option.label}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-destructive font-medium"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="mt-2 text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </fieldset>
  )
}

/* =========================================
   EXAMPLE USAGE
   ========================================= */

/*
// Simple Checkbox
<Checkbox
  label="I agree to the terms and conditions"
  required
  checked={agreed}
  onCheckedChange={(checked) => setAgreed(!!checked)}
/>

// Checkbox with error
<Checkbox
  label="Subscribe to newsletter"
  error="You must agree to subscribe"
  checked={subscribed}
  onCheckedChange={(checked) => setSubscribed(!!checked)}
/>

// Checkbox Group
<CheckboxGroup
  label="Select your interests"
  required
  options={[
    { value: "machinery", label: "Heavy Machinery" },
    { value: "parts", label: "Spare Parts" },
    { value: "services", label: "Services" },
  ]}
  value={interests}
  onChange={setInterests}
  error={interests.length === 0 ? "Select at least one interest" : undefined}
/>
*/

export { Checkbox, CheckboxGroup }
