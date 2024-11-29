import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPostById } from '../utils/api.js';
export const Route = createFileRoute('/list/$id')({
    component: RouteComponent,
});

function RouteComponent() {
    const [idData, setIddata] = useState({})
    const { id } = Route.useParams();
    const { data, error, isLoading } = useQuery({
        queryKey: ['list', id], // 确保 postId 是定义的且不为 undefined
        queryFn: () => fetchPostById(id)
    });
    useEffect(() => {
        if (data) {
            setIddata(data)
        }
    }, [data, id])
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