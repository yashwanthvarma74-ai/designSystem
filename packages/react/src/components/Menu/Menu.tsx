import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Separator as AriaSeparator,
  type Key,
} from 'react-aria-components';
import { cx } from '../../utils/cx';
import { buttonClass, type ButtonSize, type ButtonVariant } from '../Button/Button';
import styles from './Menu.module.css';

export interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Menu({ open, defaultOpen, onOpenChange, children }: MenuProps) {
  return (
    <AriaMenuTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </AriaMenuTrigger>
  );
}

export interface MenuTriggerProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  'aria-label'?: string;
}

function MenuButton({
  children,
  variant = 'secondary',
  size = 'md',
  className,
  ...rest
}: MenuTriggerProps) {
  return (
    <AriaButton className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </AriaButton>
  );
}

export interface MenuContentProps {
  children: ReactNode;
  'aria-label': string;
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end';
  onAction?: (key: Key) => void;
}

function MenuContent({
  children,
  placement = 'bottom start',
  onAction,
  ...rest
}: MenuContentProps) {
  return (
    <AriaPopover placement={placement} offset={6} className={styles.popover}>
      <AriaMenu className={styles.menu} onAction={onAction} {...rest}>
        {children}
      </AriaMenu>
    </AriaPopover>
  );
}

export interface MenuItemProps {
  id?: string;
  children: ReactNode;
  textValue?: string;
  disabled?: boolean;
  danger?: boolean;
  onAction?: () => void;
  /** Text for a keyboard shortcut hint, shown on the right. */
  shortcut?: string;
  icon?: ReactNode;
}

function MenuItem({
  id,
  children,
  textValue,
  disabled,
  danger,
  onAction,
  shortcut,
  icon,
}: MenuItemProps) {
  return (
    <AriaMenuItem
      id={id}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      isDisabled={disabled}
      onAction={onAction}
      className={cx(styles.item, danger && styles.danger)}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.itemLabel}>{children}</span>
      {shortcut && <kbd className={styles.shortcut}>{shortcut}</kbd>}
    </AriaMenuItem>
  );
}

function MenuSeparator() {
  return <AriaSeparator className={styles.separator} />;
}

Menu.Trigger = MenuButton;
Menu.Content = MenuContent;
Menu.Item = MenuItem;
Menu.Separator = MenuSeparator;
