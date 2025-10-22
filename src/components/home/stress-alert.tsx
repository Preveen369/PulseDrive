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
import { BellRing, Coffee, Wind } from 'lucide-react';

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
            Your stress levels are elevated. Consider taking a short break to ensure your safety and well-being.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse sm:flex-col-reverse gap-2">
          <AlertDialogAction className="w-full" onClick={() => onOpenChange(false)}>
            <Coffee /> Take a Break
          </AlertDialogAction>
          <AlertDialogAction className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => onOpenChange(false)}>
            <Wind /> Breathing Exercise
          </AlertDialogAction>
          <AlertDialogCancel className="w-full mt-0" onClick={() => onOpenChange(false)}>
            Dismiss
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
