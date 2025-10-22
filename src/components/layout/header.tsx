'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { HeartPulse, Home, LayoutDashboard, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];


export function Header() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

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
       <nav className="hidden md:flex items-center gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
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
