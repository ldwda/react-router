import { useEffect } from 'react';
import { createFileRoute, useRouter, ErrorComponent, } from '@tanstack/react-router';
import { useSuspenseQuery, useQueryErrorResetBoundary, } from '@tanstack/react-query';
import { fetchPostById } from '../utils/api.js';
export const Route = createFileRoute('/list/$id')({
    loader: async ({ params: { id }, context: { queryClient } }) => {
        // 确保数据在进入路由前已加载
        await queryClient.ensureQueryData({
            queryKey: ['list', id],
            queryFn: () => fetchPostById(id),
        });
    },
    component: RouteComponent,
    errorComponent: PostErrorComponent
});
function RouteComponent() {
    const { id } = Route.useParams();
    const { data: idData, error, isLoading } = useSuspenseQuery({
        queryKey: ['list', id],
        queryFn: () => fetchPostById(id)
    })
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div>
            <p>{idData.title}</p>
            <p>{idData.category}</p>
            <p>{idData.body}</p>
        </div>
    )
}

export function PostErrorComponent() {
    const router = useRouter()
    const queryErrorResetBoundary = useQueryErrorResetBoundary()
    useEffect(() => {
        queryErrorResetBoundary.reset()
    }, [queryErrorResetBoundary])
    return (
        <div>
            <button
                onClick={() => {
                    router.invalidate()
                }}
            >
                retry
            </button>
            <ErrorComponent />
        </div>
    )
}