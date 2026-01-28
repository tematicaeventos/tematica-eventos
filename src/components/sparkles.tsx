'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const SPARKLE_COLORS = [
  'bg-yellow-300/80',
  'bg-white/90',
  'bg-blue-300/80',
  'bg-pink-300/80',
];

const SparkleParticle = ({ id }: { id: number }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const colorClass = SPARKLE_COLORS[id % SPARKLE_COLORS.length];

  useEffect(() => {
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const animationDuration = `${Math.random() * 1.5 + 1}s`; // 1-2.5s
    const animationDelay = `${Math.random() * 3}s`;
    const size = `${Math.random() * 6 + 4}px`; // 4px to 10px

    setStyle({
        top,
        left,
        width: size,
        height: size,
        animation: `sparkle-fade ${animationDuration} ease-in-out ${animationDelay} infinite`,
    });
  }, [id]);

  return (
    <div
      className={cn(
        'sparkle-particle absolute rounded-full',
        colorClass
      )}
      style={style}
    />
  );
};


export const Sparkles = ({ count = 70 }: { count?: number }) => {
    const [particles, setParticles] = useState<number[]>([]);
    
    useEffect(() => {
        setParticles(Array.from({ length: count }, (_, i) => i));
    }, [count]);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
            {particles.map(id => (
                <SparkleParticle key={id} id={id} />
            ))}
        </div>
    );
};
