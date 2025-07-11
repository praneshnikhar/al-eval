'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useRouter } from 'next/navigation';
import type { Challenge } from '@/lib/data';
import { challenges as initialChallenges } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';

const hostChallengeSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters long.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  difficulty: z.string({ required_error: 'Please select a difficulty level.' }),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date({ required_error: 'An end date is required.' }),
  maxParticipants: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce
        .number({invalid_type_error: "Must be a number"})
        .positive({message: "Must be a positive number"})
        .int()
        .optional()
  ),
  evaluationType: z.enum(['automated', 'human', 'mixed'], { required_error: 'Please select an evaluation type.' }),
}).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});

type HostChallengeFormValues = z.infer<typeof hostChallengeSchema>;

interface HostChallengeFormProps {
  initialData?: Challenge;
}

export function HostChallengeForm({ initialData }: HostChallengeFormProps) {
  const isEditMode = !!initialData;
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<HostChallengeFormValues>({
    resolver: zodResolver(hostChallengeSchema),
    defaultValues: isEditMode
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          difficulty: initialData.difficulty.toLowerCase(),
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
          maxParticipants: initialData.maxParticipants,
          evaluationType: initialData.evaluationType,
        }
      : {
          title: '',
          description: '',
          evaluationType: 'mixed',
          maxParticipants: undefined,
        },
  });

  function onSubmit(data: HostChallengeFormValues) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to host a challenge.",
        });
        return;
    }
    
    const difficulty = data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1) as Challenge['difficulty'];

    try {
      const storedChallengesJSON = localStorage.getItem('challenges');
      const currentChallenges = storedChallengesJSON 
        ? JSON.parse(storedChallengesJSON).map((c: any) => {
            if (!c || !c.id || !c.startDate || !c.endDate) return null;
            const startDate = new Date(c.startDate);
            const endDate = new Date(c.endDate);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
            return { ...c, startDate, endDate };
          }).filter(Boolean) as Challenge[]
        : initialChallenges;
      
      if (isEditMode && initialData) {
         const updatedChallenge: Challenge = {
          ...initialData,
          title: data.title,
          description: data.description,
          category: data.category,
          difficulty: difficulty,
          startDate: data.startDate,
          endDate: data.endDate,
          maxParticipants: data.maxParticipants,
          evaluationType: data.evaluationType,
          status: data.startDate > new Date() ? 'Upcoming' : (data.endDate < new Date() ? 'Completed' : 'Active'),
        };

        const updatedChallenges = currentChallenges.map((c: Challenge) => c.id === initialData.id ? updatedChallenge : c);
        localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
        
        toast({
          title: 'Challenge Updated!',
          description: 'Your challenge has been successfully updated.',
        });

      } else {
        const newChallenge: Challenge = {
          id: `challenge-${Date.now()}`,
          title: data.title,
          description: data.description,
          category: data.category,
          difficulty: difficulty,
          startDate: data.startDate,
          endDate: data.endDate,
          host: user.email.split('@')[0],
          hostEmail: user.email,
          participantCount: 0,
          status: data.startDate > new Date() ? 'Upcoming' : 'Active',
          maxParticipants: data.maxParticipants,
          evaluationType: data.evaluationType,
        };
        const updatedChallenges = [newChallenge, ...currentChallenges];
        localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
        toast({
          title: 'Challenge Created!',
          description: 'Your new challenge is now live on the Challenges page.',
        });
      }

      form.reset();
      router.push('/challenges');
    } catch (error) {
      console.error("Failed to save challenge:", error);
      toast({
        variant: "destructive",
        title: 'Save Failed',
        description: 'Could not save the challenge. Please try again.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-muted-foreground">Give your challenge a name and describe it for participants.</p>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenge Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Creative Story Generation Contest" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenge Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the goals, rules, and evaluation criteria for your challenge."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Reasoning">Reasoning</SelectItem>
                    <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                    <SelectItem value="Code Generation">Code Generation</SelectItem>
                    <SelectItem value="Translation">Translation</SelectItem>
                    <SelectItem value="Summarization">Summarization</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0)) && !isEditMode
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                if (!startDate) return true;
                                return date <= startDate;
                            }}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Participants <span className='text-muted-foreground'>(Optional)</span></FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                Leave blank for unlimited participants.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
         <div>
            <h3 className="text-lg font-medium">Evaluation Criteria</h3>
            <p className="text-sm text-muted-foreground">Define how submissions will be judged.</p>
        </div>
         <FormField
          control={form.control}
          name="evaluationType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Evaluation Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="automated" /></FormControl>
                    <FormLabel className="font-normal">Automated</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="human" /></FormControl>
                    <FormLabel className="font-normal">Human Review</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="mixed" /></FormControl>
                    <FormLabel className="font-normal">Mixed (Automated + Human)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto">{isEditMode ? 'Save Changes' : 'Create Challenge'}</Button>
      </form>
    </Form>
  );
}
