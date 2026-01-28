'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuoteSummaryBarProps = {
    total: number;
    onViewQuoteClick: () => void;
};

export function QuoteSummaryBar({ total, onViewQuoteClick }: QuoteSummaryBarProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className={cn(
            "fixed top-16 left-0 right-0 z-40 bg-background/95 p-2 border-b border-border shadow-lg md:hidden",
            "transition-all duration-300 ease-in-out",
            total > 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            )}
        >
            <div className="container mx-auto flex items-center justify-between gap-2">
                <div className='flex-1 truncate'>
                    <p className="text-xs text-foreground">Total actual</p>
                    <p className="font-bold text-lg text-foreground truncate">{formatCurrency(total)}</p>
                </div>
                <Button onClick={onViewQuoteClick} size="sm" className="group whitespace-nowrap">
                    Ver cotización
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </div>
    );
}
