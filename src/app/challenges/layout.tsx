'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
