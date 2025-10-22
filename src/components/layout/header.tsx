import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeartPulse } from 'lucide-react';

export function Header() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-primary font-headline">
          PulseDrive
        </h1>
      </div>
      <Avatar>
        {userAvatar && (
          <AvatarImage
            src={userAvatar.imageUrl}
            alt={userAvatar.description}
            data-ai-hint={userAvatar.imageHint}
          />
        )}
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}
