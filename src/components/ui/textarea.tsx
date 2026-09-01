import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  errorMessage?: string | null
  error?: string | null
  containerClassName?: string
  errorClassName?: string
}

function Textarea({
  className,
  containerClassName,
  errorMessage,
  error,
  errorClassName,
  id,
  "aria-invalid": ariaInvalidProp,
  "aria-describedby": ariaDescribedByProp,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id || generatedId
  const activeError = errorMessage ?? error
  const errorId = activeError ? `${textareaId}-error` : undefined
  const isInvalid = ariaInvalidProp !== undefined ? ariaInvalidProp : Boolean(activeError)

  const ariaDescribedBy = [ariaDescribedByProp, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("w-full", containerClassName)}>
      <textarea
        id={textareaId}
        data-slot="textarea"
        aria-invalid={isInvalid ? "true" : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "flex min-h-[80px] w-full rounded-[12px] border border-border bg-card px-3.5 py-3 text-sm text-foreground shadow-none outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted",
          "disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-input/50 disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          "resize-y",
          className
        )}
        {...props}
      />
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

export { Textarea }
