import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ProductsPageClient from './ProductsPageClient';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>}>
            <ProductsPageClient />
        </Suspense>
    );
}
