'use client';

import { useState } from 'react';
import type { Prompt } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelComparisonCard } from './model-comparison-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DashboardClientProps {
  prompts: Prompt[];
}

export function DashboardClient({ prompts }: DashboardClientProps) {
  const [selectedPromptId, setSelectedPromptId] = useState(prompts[0].id);

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluation Dashboard</h1>
        <p className="text-muted-foreground">Select a prompt to see how different models responded.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label htmlFor="prompt-select" className="font-semibold">Select Prompt:</label>
        <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
          <SelectTrigger id="prompt-select" className="w-full md:w-[400px]">
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent>
            {prompts.map(prompt => (
              <SelectItem key={prompt.id} value={prompt.id}>
                {prompt.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{selectedPrompt.text}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {selectedPrompt?.models.map(model => (
          <ModelComparisonCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}
