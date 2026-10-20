import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

// Coral `destructive` is too light for small text (~2.9:1), so the message is
// set in foreground and the colour carries only the icon.
export function FieldError({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('mt-1 flex items-start gap-1.5 text-sm text-foreground', className)} role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      {children}
    </p>
  );
}
