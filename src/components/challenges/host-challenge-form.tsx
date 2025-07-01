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

export function HostChallengeForm() {
  const { toast } = useToast();
  const form = useForm<HostChallengeFormValues>({
    resolver: zodResolver(hostChallengeSchema),
    defaultValues: {
      title: '',
      description: '',
      maxParticipants: undefined,
    },
  });

  function onSubmit(data: HostChallengeFormValues) {
    console.log(data);
    toast({
      title: 'Challenge Submitted!',
      description: 'Your new challenge has been submitted for review.',
    });
    form.reset();
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reasoning">Reasoning</SelectItem>
                    <SelectItem value="creative-writing">Creative Writing</SelectItem>
                    <SelectItem value="code-generation">Code Generation</SelectItem>
                    <SelectItem value="translation">Translation</SelectItem>
                    <SelectItem value="summarization">Summarization</SelectItem>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                date < new Date(new Date().setHours(0, 0, 0, 0))
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
                  defaultValue={field.value}
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
        <Button type="submit" className="w-full md:w-auto">Create Challenge</Button>
      </form>
    </Form>
  );
}
