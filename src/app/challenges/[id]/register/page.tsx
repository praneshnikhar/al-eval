'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Challenge } from '@/lib/data';
import { challenges as initialChallenges } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const registrationSchema = z.object({
  name: z.string().min(2, { message: 'Name or Team Name must be at least 2 characters.' }),
  modelName: z.string().min(2, { message: 'Model name must be at least 2 characters.' }),
  agree: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the rules and guidelines.' }),
  }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterChallengePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    try {
      const storedChallengesJSON = localStorage.getItem('challenges');
      const allChallenges: Challenge[] = storedChallengesJSON 
        ? JSON.parse(storedChallengesJSON).map((c: any) => {
            if (!c || !c.id || !c.startDate || !c.endDate) return null;
            const startDate = new Date(c.startDate);
            const endDate = new Date(c.endDate);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
            return { ...c, startDate, endDate };
          }).filter(Boolean) as Challenge[]
        : initialChallenges;

      const foundChallenge = allChallenges.find(c => c.id === id);
      setChallenge(foundChallenge || null);
    } catch (error) {
      console.error("Failed to load challenge from local storage:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      modelName: '',
      agree: false,
    },
  });

  function onSubmit(data: RegistrationFormValues) {
    if (!challenge) return;
    console.log('Registration data:', data);

    // In a real app, this would submit to a backend.
    // Here, we just show a success message and navigate.
    toast({
      title: 'Registration Successful!',
      description: `You have successfully joined the "${challenge.title}" challenge.`,
    });
    router.push(`/challenges/${id}`);
  }
  
  if (loading) {
      return <div className="container py-10 text-center">Loading...</div>
  }
  
  if (!challenge) {
      return (
        <div className="container py-10 text-center">
            <h1 className="text-2xl font-bold">Challenge not found</h1>
            <Button asChild variant="link" className="mt-4">
                <Link href="/challenges">Back to Challenges</Link>
            </Button>
        </div>
      )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
         <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Register for: {challenge.title}</CardTitle>
            <CardDescription>Fill out the form below to join the challenge.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name / Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI Mavericks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., My custom fine-tuned model" {...field} />
                      </FormControl>
                      <FormDescription>
                        The model you plan to use for your primary submission.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the challenge rules and guidelines.
                        </FormLabel>
                         <FormDescription>
                          You can review the full rules on the challenge details page.
                        </FormDescription>
                      </div>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                  {form.formState.isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
