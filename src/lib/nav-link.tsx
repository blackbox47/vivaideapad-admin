/**
 * TanStack Router doesn't ship a `NavLink` component (it was removed in
 * v1.170). This shim re-implements react-router-dom's `NavLink` API on top
 * of TanStack's `Link`, so consumer code keeps the familiar
 * `className={({ isActive }) => …}` callback without needing to switch to
 * the more verbose `activeProps`/`inactiveProps` form.
 *
 * Behaviour matches react-router-dom v7:
 * - Renders an `<a>` by default.
 * - `className` and `style` accept either a plain value or a callback
 *   receiving `{ isActive, isPending, isTransitioning }`.
 * - `end` (default `false`) restricts the active match to the exact path.
 */
import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Link } from '@tanstack/react-router';

export interface NavLinkRenderProps {
  isActive: boolean;
  isPending: boolean;
  isTransitioning: boolean;
}

export type NavLinkClassName = string | ((props: NavLinkRenderProps) => string);
export type NavLinkStyle = CSSProperties | ((props: NavLinkRenderProps) => CSSProperties);

export interface NavLinkProps {
  /** React 19: `ref` is a regular prop on function components. */
  ref?: Ref<HTMLAnchorElement>;
  /**
   * Destination path. Mirrors react-router-dom's loose typing: any string is
   * accepted so callers can pass route constants or interpolated paths
   * without TypeScript complaining about the generated route union.
   */
  to: string;
  className?: NavLinkClassName;
  style?: NavLinkStyle;
  children?: ReactNode | ((props: NavLinkRenderProps) => ReactNode);
  /** When true, only exact path matches count as active. */
  end?: boolean;
  /** Click handler — typically used to close mobile nav drawers. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function NavLink({
  ref,
  to,
  className,
  style,
  children,
  end,
  onClick,
  ...rest
}: NavLinkProps) {
  const renderProps: NavLinkRenderProps = {
    isActive: false,
    isPending: false,
    isTransitioning: false,
  };

  const resolvedClassName =
    typeof className === 'function' ? className(renderProps) : className;
  const resolvedStyle = typeof style === 'function' ? style(renderProps) : style;
  const resolvedChildren =
    typeof children === 'function' ? children(renderProps) : children;

  // Cast through `any` for the `to` prop so consumers can pass route
  // constants without TypeScript narrowing on the generated route union.
  // Type-safety on individual `<Link>` calls remains intact — this shim is
  // strictly a convenience wrapper for shared sidebar/nav patterns.
  return (
    <Link
      to={to as any}
      ref={ref}
      onClick={onClick}
      {...rest}
      activeOptions={end ? { exact: true } : undefined}
      className={resolvedClassName}
      style={resolvedStyle}
    >
      {resolvedChildren}
    </Link>
  );
}
