import type { ReactNode, SVGProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './Icon.module.css';

const paths = {
  check: <path d="M4 10.5l3.5 3.5L16 5.5" />,
  'chevron-down': <path d="M5 8l5 5 5-5" />,
  'chevron-up': <path d="M5 12l5-5 5 5" />,
  'chevron-right': <path d="M8 5l5 5-5 5" />,
  'chevron-left': <path d="M12 5l-5 5 5 5" />,
  close: <path d="M5 5l10 10M15 5L5 15" />,
  search: (
    <>
      <circle cx="9" cy="9" r="5" />
      <path d="M13 13l3.5 3.5" />
    </>
  ),
  plus: <path d="M10 4v12M4 10h12" />,
  minus: <path d="M4 10h12" />,
  more: (
    <>
      <circle cx="4.5" cy="10" r="1" />
      <circle cx="10" cy="10" r="1" />
      <circle cx="15.5" cy="10" r="1" />
    </>
  ),
  'arrow-up': <path d="M10 16V4M5 9l5-5 5 5" />,
  'arrow-down': <path d="M10 4v12M5 11l5 5 5-5" />,
  sort: <path d="M7 8l3-3 3 3M7 12l3 3 3-3" />,
  info: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.5M10 6.5v.01" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.8 10.2l2.4 2.4 4-4.6" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="M10 3.5l7.2 12.5H2.8L10 3.5z" />
      <path d="M10 8.5v3.2M10 14v.01" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" />
    </>
  ),
  sun: (
    <>
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.7 4.7l1.3 1.3M14 14l1.3 1.3M4.7 15.3L6 14M14 6l1.3-1.3" />
    </>
  ),
  moon: <path d="M16 11.5A6.5 6.5 0 018.5 4a6.5 6.5 0 107.5 7.5z" />,
  contrast: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3v14a7 7 0 000-14z" fill="currentColor" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 11l2-6h10l2 6v4.5a1 1 0 01-1 1H4a1 1 0 01-1-1V11z" />
      <path d="M3 11h4l1 2h4l1-2h4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;
export const iconNames = Object.keys(paths) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> {
  name: IconName;
  size?: number | string;
  /** Accessible name. Leave empty for decorative icons, which are hidden from screen readers. */
  label?: string;
}

export function Icon({ name, size = 20, label, className, ...rest }: IconProps) {
  const decorative = !label;
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      className={cx(styles.icon, className)}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
