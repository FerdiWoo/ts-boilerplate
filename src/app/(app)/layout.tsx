import { AppShell, AppShellMain } from '@/components/layout/app-shell';

export default function ProductLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
