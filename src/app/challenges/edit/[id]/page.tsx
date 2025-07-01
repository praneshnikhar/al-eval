'use client';

import { HostChallengeForm } from '@/components/challenges/host-challenge-form';
import { challenges as initialChallenges, type Challenge } from '@/lib/data';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditChallengePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    try {
      const storedChallengesJSON = localStorage.getItem('challenges');
      const allChallenges: Challenge[] = storedChallengesJSON ? JSON.parse(storedChallengesJSON).map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
        })) : initialChallenges;

      const foundChallenge = allChallenges.find(c => c.id === id);
      setChallenge(foundChallenge || null);
    } catch (error) {
      console.error("Failed to load challenge from local storage:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!loading && challenge) {
       document.title = `Edit: ${challenge.title}`;
    }
  }, [loading, challenge]);
  
  if (loading) {
    return (
        <div className="container py-10">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
  if (!challenge) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
        <p className="text-muted-foreground">The challenge you are looking for does not exist.</p>
        <Button onClick={() => router.push('/challenges')} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
         <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Challenge</h1>
            <p className="text-muted-foreground">Update the details for your evaluation challenge below.</p>
        </div>
        <HostChallengeForm initialData={challenge} />
      </div>
    </div>
  );
}
