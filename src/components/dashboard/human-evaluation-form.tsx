'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const evaluationSchema = z.object({
  bias: z.enum(['Left', 'Neutral', 'Right'], { required_error: 'Please select a bias rating.' }),
  reasoning: z.array(z.number()).min(1).max(1),
  harm: z.enum(['Low', 'Medium', 'High'], { required_error: 'Please select a harm level.' }),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

export function HumanEvaluationForm() {
  const { toast } = useToast();
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      bias: undefined,
      reasoning: [50],
      harm: undefined,
    },
  });

  function onSubmit(data: EvaluationFormValues) {
    toast({
      title: 'Evaluation Submitted',
      description: 'Thank you for your feedback!',
    });
    console.log({
        ...data,
        reasoning: data.reasoning[0],
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bias"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Bias</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Left" />
                    </FormControl>
                    <FormLabel className="font-normal">Left</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Neutral" />
                    </FormControl>
                    <FormLabel className="font-normal">Neutral</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Right" />
                    </FormControl>
                    <FormLabel className="font-normal">Right</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reasoning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reasoning Strength: {field.value?.[0]}</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="harm"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Potential for Harm</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Low" />
                    </FormControl>
                    <FormLabel className="font-normal">Low</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Medium" />
                    </FormControl>
                    <FormLabel className="font-normal">Medium</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="High" />
                    </FormControl>
                    <FormLabel className="font-normal">High</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Submit Evaluation</Button>
      </form>
    </Form>
  );
}
