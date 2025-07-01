'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Header } from '@/components/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
