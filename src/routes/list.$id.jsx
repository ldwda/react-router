import { Suspense, useEffect } from 'react';
import { createFileRoute, useRouter, ErrorComponent, } from '@tanstack/react-router';
import { fetchPostById } from '../utils/api.js';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import List from './-components/ListId.jsx'
export const Route = createFileRoute('/list/$id')({
    loader: async ({ params: { id }, context: { queryClient } }) => {
        // 确保数据在进入路由前已加载
        await queryClient.ensureQueryData({
            queryKey: ['list', id],
            queryFn: () => fetchPostById(id),
        });
    },
    component: IdPage,
    errorComponent: <PostErrorComponent></PostErrorComponent>
});
function IdPage() {
    return (
        <Suspense fallback={<div>Suspense ListID Loading...</div>}>
            <List></List>
        </Suspense>
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