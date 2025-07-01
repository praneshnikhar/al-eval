'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type Challenge, challenges as initialChallenges } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, BarChart, ArrowLeft, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ChallengeDetailPage() {
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
      const foundChallenge = initialChallenges.find(c => c.id === id);
      setChallenge(foundChallenge || null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (challenge) {
      document.title = `${challenge.title} | AI Model Evaluator`;
    }
  }, [challenge]);

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <p>Loading challenge details...</p>
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
  
  const isCompleted = challenge.status === 'Completed';

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>
        
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge
                            variant={
                                challenge.status === 'Active' ? 'default' :
                                challenge.status === 'Completed' ? 'secondary' :
                                'outline'
                            }
                             className={cn("mb-2", {
                                'border-primary/50 text-primary': challenge.status === 'Upcoming',
                                'bg-green-600 border-green-600 text-primary-foreground hover:bg-green-700': challenge.status === 'Active',
                            })}
                        >
                            {challenge.status}
                        </Badge>
                        <CardTitle className="text-3xl font-bold">{challenge.title}</CardTitle>
                        <CardDescription className="mt-1">Hosted by {challenge.host}</CardDescription>
                    </div>
                    <Button size="lg" disabled={isCompleted}>
                        {challenge.status === 'Upcoming' ? 'Register' : 'Join Challenge'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Separator className="my-4" />
                <div className="grid md:grid-cols-3 gap-6 text-sm mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span><span className="font-bold text-foreground">{challenge.participantCount}</span> Participants</span>
                    </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <BarChart className="h-5 w-5" />
                        <span><span className="font-bold text-foreground">{challenge.difficulty}</span> Difficulty</span>
                    </div>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                         <span>{format(challenge.startDate, 'MMM d, yyyy')} - {format(challenge.endDate, 'MMM d, yyyy')}</span>
                    </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{challenge.description}</p>
                  
                  <h3 className="mt-8">Rules & Guidelines</h3>
                  <ul>
                    <li>Submissions must be from a single model.</li>
                    <li>Maximum of 3 submissions per participant.</li>
                    <li>Do not use any external data not provided in the challenge dataset.</li>
                    <li>Results will be evaluated based on the specified metrics.</li>
                  </ul>
                  
                  <h3 className="mt-8">Prizes</h3>
                  <div className="flex items-center gap-4 not-prose rounded-md border p-4">
                     <Trophy className="h-10 w-10 text-yellow-500" />
                     <div>
                        <p className="font-bold">Top 3 participants will be featured on our homepage!</p>
                        <p className="text-sm text-muted-foreground">Gain visibility and recognition in the AI community.</p>
                     </div>
                  </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
