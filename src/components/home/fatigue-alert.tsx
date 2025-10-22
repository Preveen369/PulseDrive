import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Siren } from 'lucide-react';

type FatigueAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FatigueAlert({ open, onOpenChange }: FatigueAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/10 mb-4">
            <Siren className="h-6 w-6 text-yellow-400" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-headline">
            Drowsiness Alert
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You are showing signs of fatigue. For your safety, please pull over and take a break immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full" onClick={() => onOpenChange(false)}>
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
