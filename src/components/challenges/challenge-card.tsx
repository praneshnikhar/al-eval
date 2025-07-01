import type { Challenge } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BarChart, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface ChallengeCardProps {
  challenge: Challenge;
  onDelete: (challengeId: string) => void;
}

export function ChallengeCard({ challenge, onDelete }: ChallengeCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle>{challenge.title}</CardTitle>
            <Badge
                variant={
                    challenge.status === 'Active' ? 'default' :
                    challenge.status === 'Completed' ? 'secondary' :
                    'outline'
                }
                className={cn({
                    'border-primary/50 text-primary': challenge.status === 'Upcoming',
                    'bg-green-600 border-green-600 text-primary-foreground hover:bg-green-700': challenge.status === 'Active',
                })}
            >
                {challenge.status}
            </Badge>
        </div>
        <CardDescription>Hosted by {challenge.host}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{challenge.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{challenge.participantCount} Participants</span>
            </div>
            <div className="flex items-center gap-1.5">
                <BarChart className="h-4 w-4" />
                <span>{challenge.difficulty}</span>
            </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(challenge.startDate, 'MMM d')} - {format(challenge.endDate, 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <div className="flex w-full gap-2">
            <Button asChild className="w-full" disabled={challenge.status === 'Completed'}>
                <Link href={`/challenges/${challenge.id}`}>
                    {challenge.status === 'Upcoming' ? 'Register' : 'Join Challenge'}
                </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
                <Link href={`/challenges/${challenge.id}`}>View Details</Link>
            </Button>
        </div>
        <Separator className="my-1" />
        <div className="flex w-full items-center justify-between">
            <p className="text-xs text-muted-foreground">Host actions:</p>
            <div className="flex gap-1">
                <Button asChild variant="ghost" size="icon">
                    <Link href={`/challenges/edit/${challenge.id}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Challenge</span>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(challenge.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete Challenge</span>
                </Button>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
