
import { useSuspenseQuery, } from '@tanstack/react-query';
import { fetchPostById } from '../../utils/api.js';
import { getRouteApi } from '@tanstack/react-router';
const Route = getRouteApi("/list/$id")
const List = () => {
    const { id } = Route.useParams();
    const { data: idData } = useSuspenseQuery({  //百分百拿到数据，不会存在lodaing和error
        queryKey: ['list', id],
        queryFn: () => fetchPostById(id),
        suspense: true
    })
    return (
        <div>
            <p>{idData.title}</p>
            <p>{idData.category}</p>
            <p>{idData.body}</p>
        </div>
    )
}
export default List