import { prompts } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import type { Prompt } from '@/lib/data';

export const metadata = {
  title: 'Evaluation Dashboard',
  description: 'Compare AI model outputs side-by-side.',
};

export default function DashboardPage() {
  const dashboardPrompts: Prompt[] = prompts;

  return (
    <div className="container py-10">
      <DashboardClient prompts={dashboardPrompts} />
    </div>
  );
}
