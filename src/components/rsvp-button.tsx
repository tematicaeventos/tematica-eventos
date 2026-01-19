'use client';

import { useState } from 'react';
import { Check, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function RsvpButton() {
  const [isRsvpd, setIsRsvpd] = useState(false);
  const { toast } = useToast();

  const handleRsvp = () => {
    setIsRsvpd(true);
    toast({
      title: 'See you there!',
      description: "You've successfully RSVP'd for this event.",
    });
  };

  return (
    <Button
      onClick={handleRsvp}
      disabled={isRsvpd}
      size="lg"
      className={cn('w-full mt-4 md:w-auto', {
        'bg-green-600 hover:bg-green-700': isRsvpd,
      })}
    >
      {isRsvpd ? (
        <>
          <Check className="mr-2 h-5 w-5" /> Attending
        </>
      ) : (
        <>
          <PartyPopper className="mr-2 h-5 w-5" /> RSVP / Show Interest
        </>
      )}
    </Button>
  );
}
