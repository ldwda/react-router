import { Suspense, } from 'react';
import { createFileRoute, } from '@tanstack/react-router';
import { fetchPostById } from '../utils/api.js';
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
    pendingComponent: () => <div>loader1  Loading...</div>,
    errorComponent: () => <div>loader Something went wrong</div>,
});
function IdPage() {
    return (
        <Suspense fallback={<div>Suspense ListID Loading...</div>}>
            <List></List>
        </Suspense>
    )
}
