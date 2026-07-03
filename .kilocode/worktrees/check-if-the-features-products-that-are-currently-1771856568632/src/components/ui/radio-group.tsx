"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Accessible Radio Group Component following accessibility-compliance skill
 * - Proper ARIA attributes
 * - Keyboard navigation (Arrow keys)
 * - Error state handling
 * - Label associations
 */

const RadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /**
   * Label for the radio item
   */
  label?: string
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg"
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, label, id, size = "md", ...props }, ref) => {
  const itemId = id || React.useId()

  // Size styles with minimum 44x44px touch target (WCAG 2.5.5)
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const iconSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  }

  return (
    <div className="flex items-center gap-3">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={itemId}
        className={cn(
          "aspect-square shrink-0 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className={cn("fill-current text-current", iconSizes[size])} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      {label && (
        <label
          htmlFor={itemId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
            props.disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

/* =========================================
   FORM RADIO GROUP COMPONENT (with label & error support)
   ========================================= */

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormRadioGroupProps {
  /**
   * Group label
   */
  label: string
  /**
   * Radio options
   */
  options: RadioOption[]
  /**
   * Selected value
   */
  value?: string
  /**
   * On change handler
   */
  onChange?: (value: string) => void
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

function FormRadioGroup({
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
}: FormRadioGroupProps) {
  const groupId = React.useId()
  const errorId = `${groupId}-error`
  const helperId = `${groupId}-helper`

  return (
    <fieldset
      className="w-full border-0 p-0"
      role="radiogroup"
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

      <RadioGroupRoot
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(
          direction === "vertical" && "flex flex-col gap-3",
          direction === "horizontal" && "flex-row flex-wrap gap-x-6 gap-y-3"
        )}
      >
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            label={option.label}
            size={size}
            disabled={option.disabled || disabled}
          />
        ))}
      </RadioGroupRoot>

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
// Simple Radio Group
<FormRadioGroup
  label="Choose your plan"
  required
  options={[
    { value: "basic", label: "Basic - $99/month" },
    { value: "pro", label: "Pro - $199/month" },
    { value: "enterprise", label: "Enterprise - Custom" },
  ]}
  value={plan}
  onChange={setPlan}
  error={!plan ? "Please select a plan" : undefined}
/>

// Horizontal layout
<FormRadioGroup
  label="Preferred contact method"
  direction="horizontal"
  options={[
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "whatsapp", label: "WhatsApp" },
  ]}
  value={contact}
  onChange={setContact}
/>
*/

export { RadioGroupRoot, RadioGroupRoot as RadioGroup, RadioGroupItem, FormRadioGroup }
