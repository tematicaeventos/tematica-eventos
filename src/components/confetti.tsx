'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const CONFETTI_COLORS = [
  'bg-yellow-400',
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-purple-500',
  'bg-orange-500',
];

const ConfettiParticle = ({ id }: { id: number }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const colorClass = CONFETTI_COLORS[id % CONFETTI_COLORS.length];

  useEffect(() => {
    const distance = Math.random() * (Math.min(window.innerWidth, window.innerHeight) / 1.5) + 50;
    const angle = Math.random() * 360;
    const tx = Math.cos(angle * (Math.PI / 180)) * distance;
    const ty = Math.sin(angle * (Math.PI / 180)) * distance;
    
    const rStart = Math.random() * 360;
    const rEnd = rStart + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 360 + 360);

    const randomDuration = Math.random() * 3 + 4; // Animation lasts between 4s and 7s

    setStyle({
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        '--r-start': `${rStart}deg`,
        '--r-end': `${rEnd}deg`,
        animation: `confetti-explode ${randomDuration}s cubic-bezier(0.1, 1, 0.7, 1) forwards`,
    } as React.CSSProperties);
  }, [id]);

  return (
    <div
      className={cn(
        'confetti-particle absolute w-2 h-5', // Made particles longer
        colorClass
      )}
      style={style}
    />
  );
};


export const Confetti = () => {
    const [particles, setParticles] = useState<number[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const particleCount = 150;
        setParticles(Array.from({ length: particleCount }, (_, i) => i));

        const timer = setTimeout(() => {
            setVisible(false);
        }, 8000); // Hide confetti container after 8 seconds

        return () => clearTimeout(timer);
    }, []);

    if(!visible) return null;

    return (
        <div className="fixed top-1/2 left-1/2 w-px h-px pointer-events-none z-[100]">
            {particles.map(id => (
                <ConfettiParticle key={id} id={id} />
            ))}
        </div>
    );
};
