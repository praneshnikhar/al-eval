'use client';

import { useState, useEffect } from 'react';
import { challenges as initialChallenges, type Challenge } from '@/lib/data';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';


export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);
  const { toast } = useToast();

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
        setChallenges(initialChallenges);
      }
    } catch (error) {
      console.error("Failed to load challenges from local storage:", error);
      // Fallback to initial challenges
      setChallenges(initialChallenges);
    }
  }, []);

  const handleConfirmDelete = () => {
    if (!challengeToDelete) return;

    setChallenges(prev => {
      const newChallenges = prev.filter(c => c.id !== challengeToDelete);
      localStorage.setItem('challenges', JSON.stringify(newChallenges));
      return newChallenges;
    });

    toast({
      title: "Challenge Deleted",
      description: "The challenge has been successfully removed.",
    });
    setChallengeToDelete(null); // Close dialog
  };

  return (
    <>
      <div className="container py-10">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Browse Challenges</h1>
            <p className="text-muted-foreground">Find and join AI model evaluation challenges hosted by the community.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} onDelete={setChallengeToDelete} />
          ))}
        </div>
      </div>
      <AlertDialog open={!!challengeToDelete} onOpenChange={(open) => !open && setChallengeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the challenge from local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setChallengeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
