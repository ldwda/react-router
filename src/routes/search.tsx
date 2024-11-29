import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
type ItemFilters = {
    query: string;
    hasDiscount: boolean;
    categories: Category[];
};
type Category = 'electronics' | 'clothing' | 'books' | 'toys';
export const Route = createFileRoute("/search")({
    component: Search,
    validateSearch: (search: Record<string, unknown>): ItemFilters => {
        return {
            query: search.query as string,
            hasDiscount: search.hasDiscount === 'true',
            categories: search.categories as Category[],
        };
    },
});

function Search() {
    const { query, hasDiscount, categories } = Route.useSearch();

    return <pre>{JSON.stringify({ query, hasDiscount, categories }, null, 2)}</pre>;
}
