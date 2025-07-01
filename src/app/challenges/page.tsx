'use client';

import { useState, useEffect } from 'react';
import { challenges as initialChallenges, type Challenge } from '@/lib/data';
import { ChallengeCard } from '@/components/challenges/challenge-card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Browse Challenges';
    try {
      const storedChallengesJSON = localStorage.getItem('challenges');
      if (storedChallengesJSON) {
        const storedChallenges = JSON.parse(storedChallengesJSON).map((c: any) => {
          if (!c || !c.id || !c.startDate || !c.endDate) return null;
          const startDate = new Date(c.startDate);
          const endDate = new Date(c.endDate);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
          return { ...c, startDate, endDate };
        }).filter(Boolean) as Challenge[];
        
        setChallenges(storedChallenges);
      } else {
        localStorage.setItem('challenges', JSON.stringify(initialChallenges));
        setChallenges(initialChallenges);
      }
    } catch (error) {
      console.error("Failed to load challenges from local storage:", error);
      setChallenges(initialChallenges);
    } finally {
      setLoading(false);
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

  if (loading) {
     return (
      <div className="container py-10">
        <div className="space-y-2 mb-8">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                 <Skeleton className="h-10 w-full mt-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container py-10">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Browse Challenges</h1>
            <p className="text-muted-foreground">Find and join AI model evaluation challenges hosted by the community.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.length > 0 
            ? challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} onDelete={setChallengeToDelete} />
            ))
            : (
              <div className="md:col-span-3 text-center text-muted-foreground py-16">
                <h2 className="text-xl font-semibold">No Challenges Found</h2>
                <p className="mt-2">Why not host one?</p>
              </div>
            )
          }
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
