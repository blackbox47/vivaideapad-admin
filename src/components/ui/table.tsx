import * as React from "react"

import { cn } from "@/lib/utils"

interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  pinColumns?: boolean;
}

function Table({
  className,
  containerClassName,
  containerRef,
  pinColumns = false,
  ...props
}: TableProps) {
  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto table-scrollbar",
        containerClassName
      )}
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm",
          "max-md:[&_th:first-child]:static max-md:[&_th:first-child]:shadow-none max-md:[&_th:last-child]:static max-md:[&_th:last-child]:shadow-none max-md:[&_td:first-child:not([colspan])]:static max-md:[&_td:first-child:not([colspan])]:shadow-none max-md:[&_td:last-child:not([colspan])]:static max-md:[&_td:last-child:not([colspan])]:shadow-none",
          pinColumns &&
            "md:[&_th:first-child]:sticky md:[&_th:first-child]:left-0 md:[&_th:first-child]:z-20 md:[&_th:last-child]:sticky md:[&_th:last-child]:right-0 md:[&_th:last-child]:z-20 md:[&_td:first-child:not([colspan])]:sticky md:[&_td:first-child:not([colspan])]:left-0 md:[&_td:first-child:not([colspan])]:z-10 md:[&_td:first-child:not([colspan])]:bg-card md:[&_td:last-child:not([colspan])]:sticky md:[&_td:last-child:not([colspan])]:right-0 md:[&_td:last-child:not([colspan])]:z-10 md:[&_td:last-child:not([colspan])]:bg-card",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  type TableProps,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
