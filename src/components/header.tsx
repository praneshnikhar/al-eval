'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TestTube2, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Header() {
  const { user, logout } = useAuth();

  const getInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : '?';
  };

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
          {user ? (
            <>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                       <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
