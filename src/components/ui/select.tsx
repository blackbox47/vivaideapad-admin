import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { DropdownOption } from "@/utils/types/dropdown-option"

export interface SelectProps extends React.ComponentProps<"select"> {
  label?: React.ReactNode
  /** Alias for label to support alternate naming */
  level?: React.ReactNode
  labelClassName?: string
  errorMessage?: string | null
  error?: string | null
  containerClassName?: string
  errorClassName?: string
  options?: DropdownOption[]
  placeholder?: string
  allowDeselect?: boolean
  deselectOption?: boolean | string
  deselectLabel?: string
  hideChevron?: boolean
}

function Select({
  className,
  containerClassName,
  label,
  level,
  labelClassName,
  errorMessage,
  error,
  errorClassName,
  id,
  required,
  options,
  placeholder,
  allowDeselect,
  deselectOption,
  deselectLabel,
  hideChevron = false,
  children,
  "aria-invalid": ariaInvalidProp,
  "aria-describedby": ariaDescribedByProp,
  ...props
}: SelectProps) {
  const generatedId = React.useId()
  const displayLabel = label ?? level
  const selectId = id || (displayLabel ? generatedId : undefined)
  const activeError = errorMessage ?? error
  const errorId = activeError && selectId ? `${selectId}-error` : undefined
  const isInvalid = ariaInvalidProp !== undefined ? ariaInvalidProp : Boolean(activeError)

  const ariaDescribedBy = [ariaDescribedByProp, errorId].filter(Boolean).join(" ") || undefined

  const shouldShowDeselect =
    Boolean(deselectOption) ||
    Boolean(allowDeselect) ||
    Boolean(placeholder)

  const deselectText =
    typeof deselectOption === "string"
      ? deselectOption
      : deselectLabel || placeholder || (shouldShowDeselect ? "Select an option" : undefined)

  const hasEmptyOptionInList = options?.some((opt) => opt.id === "")

  const showDeselectOption = shouldShowDeselect && !hasEmptyOptionInList && Boolean(deselectText)

  const selectElement = (
    <div className="relative w-full">
      <select
        id={selectId}
        required={required}
        data-slot="select"
        aria-invalid={isInvalid ? "true" : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "flex h-auto w-full min-w-0 appearance-none rounded-[12px] border border-border bg-card px-3.5 py-3 pr-10 text-sm text-foreground shadow-none outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      >
        {showDeselectOption ? (
          <option value="">{deselectText}</option>
        ) : null}
        {options?.map((option) => (
          <option key={option.id} value={option.id} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {!hideChevron ? (
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      ) : null}
    </div>
  )

  const hasWrapper = Boolean(displayLabel || activeError || containerClassName)

  if (!hasWrapper) {
    return selectElement
  }

  return (
    <div className={cn("w-full", containerClassName)}>
      {displayLabel ? (
        <Label
          htmlFor={selectId}
          className={cn("mb-1.5 block text-[12px] font-bold text-foreground", labelClassName)}
        >
          {displayLabel}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      {selectElement}
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

export { Select }
