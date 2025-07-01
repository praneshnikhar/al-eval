import type { Metadata } from 'next';
import { challenges } from '@/lib/data';
import { ChallengeCard } from '@/components/challenges/challenge-card';

export const metadata: Metadata = {
    title: 'Browse Challenges',
    description: 'Find and join AI model evaluation challenges.',
};

export default function ChallengesPage() {
  return (
    <div className="container py-10">
      <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Browse Challenges</h1>
          <p className="text-muted-foreground">Find and join AI model evaluation challenges hosted by the community.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
