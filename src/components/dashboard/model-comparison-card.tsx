'use client';

import type { ModelPerformance } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { HumanEvaluationForm } from './human-evaluation-form';
import { ToxicityEvaluator } from './toxicity-evaluator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';

interface ModelComparisonCardProps {
  model: ModelPerformance;
}

export function ModelComparisonCard({ model }: ModelComparisonCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          {model.name}
        </CardTitle>
        <CardDescription>Model Output & Evaluation</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Output:</h4>
          <div className="prose prose-sm dark:prose-invert max-h-48 overflow-y-auto rounded-md border bg-muted/50 p-3 text-sm text-foreground">
            {model.output}
          </div>
        </div>

        <div className="space-y-4 pt-2">
           <h4 className="font-semibold">Pre-computed Evaluation:</h4>
           <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bias</p>
              <Badge
                className="mt-1"
                variant={
                  model.evaluation.bias === 'Left' ? 'destructive' :
                  model.evaluation.bias === 'Neutral' ? 'secondary' :
                  'default'
                }
              >
                {model.evaluation.bias}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reasoning</p>
              <div className="flex items-center gap-2">
                <Progress value={model.evaluation.reasoning} className="mt-2 h-2" />
                <span className="text-xs font-bold">{model.evaluation.reasoning}%</span>
              </div>
            </div>
             <div>
              <p className="text-sm font-medium text-muted-foreground">Harm</p>
              <Badge
                className={cn("mt-1", {
                  'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80': model.evaluation.harm === 'High',
                  'border-transparent bg-yellow-400 text-yellow-950 hover:bg-yellow-400/80 dark:bg-yellow-600 dark:text-yellow-50 dark:hover:bg-yellow-600/80': model.evaluation.harm === 'Medium',
                  'border-transparent bg-green-500 text-white hover:bg-green-500/80 dark:bg-green-600 dark:text-white dark:hover:bg-green-600/80': model.evaluation.harm === 'Low',
                })}
              >
                {model.evaluation.harm}
              </Badge>
            </div>
           </div>
        </div>
      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Evaluate this response</AccordionTrigger>
                <AccordionContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">Automated Toxicity Score:</h4>
                        <ToxicityEvaluator text={model.output} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Your Evaluation:</h4>
                        <HumanEvaluationForm />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
