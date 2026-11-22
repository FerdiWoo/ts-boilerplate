import type { ComponentProps } from 'react';

import { cn } from '@/lib/ui/cn';

type InputProps = ComponentProps<'input'>;

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'border-border bg-surface placeholder:text-muted focus-visible:border-accent focus-visible:ring-accent/10 aria-invalid:border-danger aria-invalid:ring-danger/10 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
