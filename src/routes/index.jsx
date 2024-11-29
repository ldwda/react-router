import React, { useEffect, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLists } from '../utils/api.js';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';


export const Route = createFileRoute('/')({
    component: List,
});

function List() {
    const [category, setCategory] = useState(''); // 分类筛选
    const [value, setValue] = useState(''); // 搜索输入值


    // 使用 useInfiniteQuery 钩子获取分页数据
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['posts', category, value], // 按分类和搜索条件变化重新查询
        queryFn: ({ pageParam = 1 }) => fetchLists({ page: pageParam, query: value, category, pageSize: 5, }),
        getNextPageParam: (lastPage, allPages) => {
            console.log("Last page data:", lastPage);
            console.log("allPages:", allPages);
            if (lastPage.hasNextPage) {
                return +lastPage.page + 1; // 返回下一页
            }
            return undefined; // 没有更多页面时返回 undefined
        },
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        keepPreviousData: true
    });


    const loadMoreRef = useRef(null);

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


    // 分类过滤函数
    const onCategory = (category) => {
        setCategory(category === 'all' ? '' : category);
    };

    // 搜索框输入处理
    const onSearch = (e) => {
        setValue(e.target.value);
    };

    // 渲染加载中的状态
    if (isLoading) return <div>加载中...</div>;

    // 渲染错误状态
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                {/* 搜索框 */}
                <input
                    type="text"
                    value={value}
                    onChange={onSearch}
                    placeholder="请输入搜索关键词"
                    style={{ marginRight: '10px' }}
                />
                <span>搜索</span>
            </div>

            {/* 分类筛选 */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                {['all', 'Category 0', 'Category 1', 'Category 2'].map((item) => (
                    <button
                        key={item}
                        onClick={() => onCategory(item)}
                        style={{
                            marginRight: '10px',
                            backgroundColor: category === item ? '#1890ff' : '#f0f0f0',
                            color: category === item ? '#fff' : '#000',
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* 列表展示 */}
            <ul>
                {data?.pages?.map((page, pageIndex) =>
                    page.data.map((item) => (
                        <li key={item.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
                            <Link
                                to="/list/$id"
                                params={{ id: item.id }}
                                activeProps={{ className: 'font-bold underline' }}
                            >
                                <h4>{item.title}</h4>
                                <p>{item.body}</p>
                            </Link>
                        </li>
                    ))
                )}
            </ul>

            {isFetchingNextPage ? 'true' : 'false'}
            {hasNextPage ? 'true' : 'false'}

            <div className="loadMore" style={{ height: '30px', lineHeight: '30px' }} ref={loadMoreRef}>
                {
                    isFetchingNextPage ? <span>Loading...</span> : <span>--- 我是有底线的 ---</span>
                }
            </div>
            <Outlet />
        </div>
    );
}
