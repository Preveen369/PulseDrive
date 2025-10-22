'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { HeartPulse, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-primary font-headline">
          PulseDrive
        </h1>
      </div>
      {!isLoading && user && (
         <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              {user.photoURL ? (
                <AvatarImage
                  src={user.photoURL}
                  alt={user.displayName || 'User Avatar'}
                />
              ) : null}
              <AvatarFallback>
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email!.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
