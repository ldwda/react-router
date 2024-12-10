import { useEffect, useState, useRef, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLists } from '../utils/api.js'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { throttle } from 'lodash';
export const Route = createFileRoute('/list')({
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData({
            queryKey: ['posts'],  // 唯一的查询键
            queryFn: fetchLists,  // 查询函数
        }),
    component: List
})

function List() {
    const [category, setCategory] = useState('all') // 分类筛选
    const [value, setValue] = useState('') // 搜索输入值
    const inputRef = useRef(null)
    const loadMoreRef = useRef(null)
    const [isSearching, setIsSearching] = useState(false); // 标记是否在搜索
    // 使用 useInfiniteQuery 钩子获取分页数据
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
        // refetchInterval: 10000,
        queryKey: ['posts', category], // 按分类和搜索条件变化重新查询
        queryFn: ({ pageParam = 1 }) =>
            fetchLists({ page: pageParam, query: value, category, pageSize: 5 }),
        getNextPageParam: (lastPage) => {
            if (lastPage.hasNextPage) {
                return +lastPage.page + 1 // 返回下一页
            }
            return undefined // 没有更多页面时返回 undefined
        },
        onError: (error) => {
            console.error('Something went wrong: ', error);
        },
        refetchOnWindowFocus: false, // Prevent refetching on window focus
        keepPreviousData: true,
    })

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage()
            }
        })
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }
        return () => observer.disconnect()
    }, [hasNextPage, fetchNextPage])
    // 分类过滤函数/节流
    const throttledOnCategory = useCallback(
        throttle((category) => {
            setCategory(category)
            refetch() // 执行 refetch 重新查询
        }, 500),
        []
    )

    // 按钮点击节流
    const throttledOnButtonClick = useCallback(
        throttle(() => {
            setIsSearching(true); // 设置为加载中
            refetch().then(() => {
                setIsSearching(false); // 请求成功后取消加载状态
            }).catch((err) => {
                console.error(err);
                setIsSearching(false); // 请求失败后取消加载状态
            });
            // 这里可以执行其他逻辑，例如提交搜索或筛选
        }, 1000), // 500ms 节流间隔
        []
    )
    // 搜索框输入处理
    const onSearch = (e) => {
        const value = e.target.value;
        setValue(value); // 立即更新 UI
    }
    // 渲染加载中的状态
    if (isLoading) return <div>加载中...</div>
    // 渲染错误状态
    if (isError) return <div>Error: {error.message}</div>
    return (
        <div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                {/* 搜索框 */}
                <input
                    type="text"
                    value={value}
                    onChange={onSearch}
                    ref={inputRef} // 绑定引用
                    placeholder="请输入搜索关键词"
                    style={{ marginRight: '10px' }}
                />
                <button onClick={throttledOnButtonClick}>{isSearching ? '搜索中...' : '搜索'}</button>
            </div>
            {/* 分类筛选 */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                {['all', 'Category 0', 'Category 1', 'Category 2'].map((item) => (
                    <button
                        key={item}
                        onClick={() => throttledOnCategory(item)}
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
            <div style={{ display: 'flex' }}>
                <div>
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
                </div>
                <Outlet />
            </div>
        </div>
    )
}
