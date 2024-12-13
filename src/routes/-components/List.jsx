import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLists } from '../../utils/api.js';
import { Link } from '@tanstack/react-router';

const Lists = forwardRef(({ category, value }, ref) => {
    const loadMoreRef = useRef(null);
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['posts', category], // 按分类和搜索条件变化重新查询
        queryFn: ({ pageParam = 1 }) =>
            fetchLists({ page: pageParam, query: value, category, pageSize: 5 }),
        getNextPageParam: (lastPage) => {
            if (lastPage.hasNextPage) {
                return +lastPage.page + 1; // 返回下一页
            }
            return undefined; // 没有更多页面时返回 undefined
        },
        onError: (error) => {
            console.error('Something went wrong: ', error);
        },
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        keepPreviousData: true,
    });

    // 使用 IntersectionObserver 实现分页加载
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        refetch, // 暴露 refetch 方法
    }));

    if (isLoading) return <div>query加载中...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            {/* 列表展示 */}
            <ul>
                {data?.pages?.map((page) =>
                    page.data.map((item) => (
                        <li
                            key={item.id}
                            style={{
                                padding: '10px',
                                border: '1px solid #ccc',
                                marginBottom: '10px',
                            }}
                        >
                            <Link
                                to="/list/$id"
                                params={{ id: item.id }}
                                activeProps={{ className: 'font-bold underline' }}
                            >
                                <h4>{item.title}</h4>
                                <p>{item.body}</p>
                            </Link>
                        </li>
                    )),
                )}
            </ul>
            <div
                className="loadMore"
                style={{ height: '30px', lineHeight: '30px' }}
                ref={loadMoreRef}
            >
                {isFetchingNextPage ? (
                    <span>Loading...</span>
                ) : (
                    <span>--- 到底啦！！ ---</span>
                )}
            </div>
        </>
    );
});

Lists.displayName = 'List'; // 添加显示名称

export default Lists;