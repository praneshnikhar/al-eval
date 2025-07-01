'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { automaticToxicityEvaluation } from '@/ai/flows/automatic-toxicity-evaluation';
import { useToast } from '@/hooks/use-toast';

interface ToxicityEvaluatorProps {
  text: string;
}

export function ToxicityEvaluator({ text }: ToxicityEvaluatorProps) {
  const [toxicityScore, setToxicityScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEvaluate = async () => {
    setIsLoading(true);
    setError(null);
    setToxicityScore(null);
    try {
      const result = await automaticToxicityEvaluation({ text });
      setToxicityScore(result.toxicityScore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Evaluation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleEvaluate} disabled={isLoading} variant="outline">
        {isLoading ? 'Evaluating...' : 'Run Automatic Toxicity Check'}
      </Button>
      
      {toxicityScore !== null && (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Progress value={toxicityScore * 100} className="h-2" />
                <span className="font-bold">{(toxicityScore * 100).toFixed(1)}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
                Score: {toxicityScore.toFixed(3)}. Higher scores indicate higher potential toxicity.
            </p>
        </div>
      )}

      {error && (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
