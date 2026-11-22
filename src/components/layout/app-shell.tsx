import type { ComponentProps } from 'react';

import { cn } from '@/lib/ui/cn';

type AppShellProps = ComponentProps<'div'>;
type AppShellHeaderProps = ComponentProps<'header'>;
type AppShellBodyProps = ComponentProps<'div'>;
type AppShellSidebarProps = ComponentProps<'aside'>;
type AppShellMainProps = ComponentProps<'main'>;

function AppShell({ className, ...props }: AppShellProps) {
  return <div className={cn('min-h-screen', className)} {...props} />;
}

function AppShellHeader({ className, ...props }: AppShellHeaderProps) {
  return (
    <header className={cn('border-border border-b', className)} {...props} />
  );
}

function AppShellBody({ className, ...props }: AppShellBodyProps) {
  return <div className={cn('flex min-h-0 flex-1', className)} {...props} />;
}

function AppShellSidebar({ className, ...props }: AppShellSidebarProps) {
  return (
    <aside
      className={cn(
        'border-border hidden w-64 shrink-0 border-r lg:block',
        className
      )}
      {...props}
    />
  );
}

function AppShellMain({ className, ...props }: AppShellMainProps) {
  return <main className={cn('min-w-0 flex-1', className)} {...props} />;
}

export {
  AppShell,
  AppShellBody,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
};
export type {
  AppShellBodyProps,
  AppShellHeaderProps,
  AppShellMainProps,
  AppShellProps,
  AppShellSidebarProps,
};
