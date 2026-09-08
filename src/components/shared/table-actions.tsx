import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface TableActionItem {
  key?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export interface TableActionsProps {
  /**
   * Action items to render.
   */
  items?: TableActionItem[];
  /**
   * Alternatively, raw action button elements passed as children.
   * If >1 children are provided, they are collapsed into a 3-dots popup menu.
   * If exactly 1 child is provided, it is rendered directly.
   */
  children?: React.ReactNode;
  /**
   * Custom className for trigger or container.
   */
  className?: string;
  /**
   * Dropdown alignment (default: 'end').
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Trigger aria label.
   */
  triggerLabel?: string;
}

export function TableActions({
  items,
  children,
  className,
  align = 'end',
  triggerLabel = 'Row actions',
}: TableActionsProps) {
  // If structured items are provided:
  if (items && items.length > 0) {
    if (items.length === 1) {
      const item = items[0];
      return (
        <div className={cn('flex items-center justify-end', className)}>
          <Button
            size="sm"
            variant={item.variant === 'destructive' ? 'destructive' : 'outline'}
            disabled={item.disabled}
            onClick={item.onClick}
            className="h-auto rounded-full px-3.5 py-1.5 text-xs font-bold"
          >
            {item.icon}
            {item.label}
          </Button>
        </div>
      );
    }

    return (
      <div className={cn('flex items-center justify-end', className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
                aria-label={triggerLabel}
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="min-w-32">
            {items.map((item, index) => (
              <DropdownMenuItem
                key={item.key ?? index}
                variant={item.variant}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // If children are provided:
  const validChildren = React.Children.toArray(children).filter(Boolean);

  if (validChildren.length === 0) {
    return null;
  }

  if (validChildren.length === 1) {
    return (
      <div className={cn('flex items-center justify-end', className)}>
        {validChildren[0]}
      </div>
    );
  }

  // More than 1 action: replace with 3-dots trigger and popup
  return (
    <div className={cn('flex items-center justify-end', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
              aria-label={triggerLabel}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-32">
          {validChildren.map((child, index) => {
            if (React.isValidElement(child)) {
              const childProps = child.props as Record<string, unknown>;
              const onClick = typeof childProps.onClick === 'function'
                ? (childProps.onClick as (e: React.MouseEvent) => void)
                : undefined;
              const disabled = Boolean(childProps.disabled);
              const variant = childProps.variant;
              const childClassName = typeof childProps.className === 'string' ? childProps.className : '';
              const isDestructive =
                variant === 'destructive' ||
                childClassName.includes('danger') ||
                childClassName.includes('destructive');

              return (
                <DropdownMenuItem
                  key={child.key ?? index}
                  variant={isDestructive ? 'destructive' : 'default'}
                  disabled={disabled}
                  onClick={onClick}
                >
                  {childProps.children as React.ReactNode}
                </DropdownMenuItem>
              );
            }
            return null;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TableActions;
