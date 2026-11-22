import type { ComponentProps } from 'react';

import { cn } from '@/lib/ui/cn';

const buttonVariants = {
  primary: 'bg-accent text-accent-foreground hover:brightness-110',
  secondary: 'border-border bg-surface text-foreground border hover:bg-white/5',
  ghost: 'text-muted hover:bg-white/5 hover:text-foreground',
  danger: 'bg-danger text-background hover:brightness-110',
} as const;

const buttonSizes = {
  default: 'h-11 px-5',
  small: 'h-9 px-3',
  icon: 'size-11',
} as const;

type ButtonProps = ComponentProps<'button'> & {
  /** The visual treatment of the button. */
  variant?: keyof typeof buttonVariants;
  /** The button's target size. */
  size?: keyof typeof buttonSizes;
};

function Button({
  className,
  size = 'default',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'focus-visible:ring-accent focus-visible:ring-offset-background inline-flex shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      type={type}
      {...props}
    />
  );
}

export { Button };
export type { ButtonProps };
