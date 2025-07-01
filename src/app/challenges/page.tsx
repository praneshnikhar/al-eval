'use client';

import { useState, useEffect } from 'react';
import { challenges as initialChallenges, type Challenge } from '@/lib/data';
import { ChallengeCard } from '@/components/challenges/challenge-card';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  useEffect(() => {
    document.title = 'Browse Challenges';
    try {
      const storedChallengesJSON = localStorage.getItem('challenges');
      if (storedChallengesJSON) {
        const storedChallenges = JSON.parse(storedChallengesJSON).map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
        }));
        setChallenges(storedChallenges);
      } else {
        // If nothing is in local storage, initialize it with the static data.
        localStorage.setItem('challenges', JSON.stringify(initialChallenges));
      }
    } catch (error) {
      console.error("Failed to load challenges from local storage:", error);
      // Fallback to initial challenges is already handled by useState initial value
    }
  }, []);

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
