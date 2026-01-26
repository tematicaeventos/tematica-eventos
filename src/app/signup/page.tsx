import { Suspense } from 'react';
import { SignupForm } from './signup-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SignupSkeleton() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Crear una Cuenta</CardTitle>
                <CardDescription>Regístrate para empezar a cotizar tu evento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
            </CardContent>
        </Card>
    );
}

export default function SignupPage() {
    return (
        <div className="container flex min-h-[80vh] items-center justify-center py-8">
            <Suspense fallback={<SignupSkeleton />}>
                <SignupForm />
            </Suspense>
        </div>
    );
}
