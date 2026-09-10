import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDown } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { DropdownOption } from "@/utils/types/dropdown-option"

export interface SelectProps extends Omit<React.ComponentProps<"select">, "children"> {
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
  showRequiredIndicator?: boolean
}

function emitSelectChange(
  onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined,
  value: string,
  name?: string,
) {
  onChange?.({
    target: { value, name: name ?? "" },
    currentTarget: { value, name: name ?? "" },
  } as React.ChangeEvent<HTMLSelectElement>)
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
  showRequiredIndicator = true,
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  disabled,
  ref,
  "aria-invalid": ariaInvalidProp,
  "aria-describedby": ariaDescribedByProp,
  "aria-label": ariaLabel,
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

  const items: DropdownOption[] = [
    ...(showDeselectOption && deselectText ? [{ id: "", label: deselectText }] : []),
    ...(options ?? []),
  ]

  const stringValue =
    value === undefined || value === null ? undefined : String(value)
  const stringDefaultValue =
    defaultValue === undefined || defaultValue === null
      ? undefined
      : String(defaultValue)

  const selectElement = (
    <SelectPrimitive.Root
      value={stringValue}
      defaultValue={stringDefaultValue}
      onValueChange={(next) => emitSelectChange(onChange, next ?? "", name)}
      disabled={disabled}
      required={required}
      name={name}
      id={selectId}
      inputRef={ref as React.Ref<HTMLInputElement>}
      modal={false}
      items={items.map((item) => ({ value: item.id, label: item.label }))}
    >
      <div className="relative w-full">
        <SelectPrimitive.Trigger
          id={selectId}
          data-slot="select"
          aria-invalid={isInvalid ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          onBlur={
            onBlur
              ? (event) => {
                  onBlur({
                    ...event,
                    target: event.target as unknown as HTMLSelectElement,
                    currentTarget: event.currentTarget as unknown as HTMLSelectElement,
                  } as unknown as React.FocusEvent<HTMLSelectElement>);
                }
              : undefined
          }
          className={cn(
            "flex h-auto w-full min-w-0 items-center justify-between gap-2 rounded-[12px] border border-border bg-card px-3.5 py-3 text-left text-sm font-normal text-foreground shadow-none outline-none transition-colors",
            "hover:border-primary/40",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
            className
          )}
        >
          <SelectPrimitive.Value
            placeholder={placeholder || deselectText}
            className="min-w-0 flex-1 truncate data-placeholder:text-muted-foreground"
          />
          {!hideChevron ? (
            <SelectPrimitive.Icon className="pointer-events-none shrink-0 text-muted-foreground">
              <ChevronDown className="size-4" aria-hidden />
            </SelectPrimitive.Icon>
          ) : null}
        </SelectPrimitive.Trigger>
      </div>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          className="isolate z-[80] outline-none"
          side="bottom"
          align="start"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <SelectPrimitive.Popup
            data-slot="select-popup"
            className={cn(
              "z-[80] max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-[12px] border border-border bg-card p-1 text-sm text-foreground shadow-md outline-none",
              "data-[side=bottom]:slide-in-from-top-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            <SelectPrimitive.List>
              {items.map((option) => (
                <SelectPrimitive.Item
                  key={option.id || "empty"}
                  value={option.id}
                  disabled={option.disabled}
                  label={option.label}
                  className={cn(
                    "flex min-h-9 cursor-pointer items-center rounded-[8px] px-3 py-2 text-sm outline-none select-none",
                    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                    "data-selected:bg-primary/10 data-selected:font-semibold data-selected:text-primary",
                    "data-disabled:pointer-events-none data-disabled:opacity-50",
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
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
          {required && showRequiredIndicator ? (
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
