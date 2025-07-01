import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TestTube2, PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <TestTube2 className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              AI Model Evaluator
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
           </Button>
           <Button asChild variant="ghost">
              <Link href="/challenges">Challenges</Link>
           </Button>
           <Button asChild>
            <Link href="/challenges/host">
              <PlusCircle className="mr-2 h-4 w-4" />
              Host Challenge
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
