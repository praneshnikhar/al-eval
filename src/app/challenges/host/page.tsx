import { HostChallengeForm } from '@/components/challenges/host-challenge-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Host a New Challenge',
    description: 'Create and configure a new AI model evaluation challenge.',
};

export default function HostChallengePage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Host a New Challenge</h1>
            <p className="text-muted-foreground">Fill out the details below to create your evaluation challenge.</p>
        </div>
        <HostChallengeForm />
      </div>
    </div>
  );
}
