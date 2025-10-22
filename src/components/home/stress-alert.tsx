import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BellRing, Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

type StressAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StressAlert({ open, onOpenChange }: StressAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <BellRing className="h-6 w-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-headline">
            High Stress Detected
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your stress levels are elevated. Consider taking a short break or listening to some calming music.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <AlertDialogAction asChild>
                <Button onClick={() => onOpenChange(false)} className='w-full'>Okay</Button>
            </AlertDialogAction>
            <Button variant="outline" className="w-full" asChild>
                <Link href="https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO" target="_blank">
                    <Music className="mr-2 h-4 w-4" />
                    Play Calming Music
                </Link>
            </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
