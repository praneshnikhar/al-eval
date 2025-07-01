'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// NOTE: This is a mock authentication system using localStorage.
// In a real application, you would use a secure, server-based authentication method.

interface User {
  email: string;
}

// In a real app, this would be a secure hash. Here, it's plain text for demonstration.
interface StoredUser extends User {
  password_plaintext: string; 
}

const USERS_STORAGE_KEY = 'auth.users';
const SESSION_STORAGE_KEY = 'auth.session';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const sessionUserJson = localStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionUserJson) {
        setUser(JSON.parse(sessionUserJson));
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      // Clear potentially corrupted session data
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setLoading(false);
    }

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === SESSION_STORAGE_KEY) {
            try {
                const sessionUserJson = event.newValue;
                if (sessionUserJson) {
                    setUser(JSON.parse(sessionUserJson));
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error('Failed to handle storage change', e);
                setUser(null);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signup = (email: string, password_plaintext: string): User => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: StoredUser = { email, password_plaintext };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    return { email };
  };

  const login = (email: string, password_plaintext: string): User => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

    const foundUser = users.find(u => u.email === email);

    if (!foundUser || foundUser.password_plaintext !== password_plaintext) {
      throw new Error('Invalid email or password.');
    }

    const sessionUser: User = { email: foundUser.email };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    
    // Manually dispatch storage event to sync across tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: SESSION_STORAGE_KEY,
      newValue: JSON.stringify(sessionUser)
    }));

    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
     // Manually dispatch storage event to sync across tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: SESSION_STORAGE_KEY,
      newValue: null
    }));
    router.push('/login');
  };

  return { user, loading, signup, login, logout };
}
