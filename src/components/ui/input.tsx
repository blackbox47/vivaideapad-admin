import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  label?: React.ReactNode
  labelClassName?: string
  errorMessage?: string | null
  error?: string | null
  containerClassName?: string
  errorClassName?: string
  rightSlot?: React.ReactNode
  showRequiredIndicator?: boolean
}

function Input({
  className,
  containerClassName,
  label,
  labelClassName,
  errorMessage,
  error,
  errorClassName,
  rightSlot,
  showRequiredIndicator = true,
  id,
  type,
  required,
  "aria-invalid": ariaInvalidProp,
  "aria-describedby": ariaDescribedByProp,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id || (label ? generatedId : undefined)
  const activeError = errorMessage ?? error
  const errorId = activeError && inputId ? `${inputId}-error` : undefined
  const isInvalid = ariaInvalidProp !== undefined ? ariaInvalidProp : Boolean(activeError)

  const ariaDescribedBy = [ariaDescribedByProp, errorId].filter(Boolean).join(" ") || undefined

  const hasWrapper = Boolean(label || activeError || containerClassName || rightSlot)
  const isSpecialType = type === "checkbox" || type === "radio" || type === "file"

  const inputElement = (
    <InputPrimitive
      id={inputId}
      type={type}
      required={required}
      data-slot="input"
      aria-invalid={isInvalid ? "true" : undefined}
      aria-describedby={ariaDescribedBy}
      className={cn(
        isSpecialType
          ? className
          : cn(
              "flex h-auto w-full min-w-0 rounded-[12px] border border-border bg-card px-3.5 py-3 text-sm text-foreground shadow-none outline-none transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
              rightSlot && "pr-10",
              className
            )
      )}
      {...props}
    />
  )

  if (!hasWrapper) {
    return inputElement
  }

  const renderedInput = rightSlot ? (
    <div className="relative flex items-center">
      {inputElement}
      <div className="absolute right-3 flex items-center">{rightSlot}</div>
    </div>
  ) : (
    inputElement
  )

  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        <Label
          htmlFor={inputId}
          className={cn("mb-1.5 block text-[12px] font-bold text-foreground", labelClassName)}
        >
          {label}
          {required && showRequiredIndicator ? (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      {renderedInput}
      {activeError ? (
        <p
          id={errorId}
          role="alert"
          className={cn("mt-1.5 text-xs font-semibold text-destructive", errorClassName)}
        >
          {activeError}
        </p>
      ) : null}
    </div>
  )
}

export { Input }
