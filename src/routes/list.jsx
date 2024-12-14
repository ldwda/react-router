import { Suspense, useEffect, useState, useRef } from 'react'
import { fetchLists } from '../utils/api.js'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Input from './-components/Input.tsx';
import Category from './-components/category.tsx';
import Lists from './-components/List.jsx'
export const Route = createFileRoute('/list')({
    loader: async ({ context: { queryClient } }) => {
        let res = await queryClient.ensureQueryData({
            queryKey: ['posts'],  // 唯一的查询键
            queryFn: fetchLists
        })
        console.log(res, 'loaderRes');
        return res
    },
    validateSearch: (search) => {
        // 验证和规范化查询参数
        const validatedSearch = {
            category: search.category || 'all', // 默认分类为 'all'
            value: search.value || '',
        };
        // console.log(validatedSearch, 'validatedSearch in validateSearch');
        return validatedSearch;
    },
    pendingComponent: () => <div>loader  Loading...</div>,
    errorComponent: () => <div>loader Something went wrong</div>,
    component: List
})

function List() {
    const listRef = useRef(null);
    const navigate = Route.useNavigate(); // 用于更新路由
    const search = Route.useSearch(); // 获取 URL 中的 search 参数
    const [category, setCategory] = useState(search?.category || 'all'); //
    const [value, setValue] = useState(search?.value || '') // 搜索输入值
    const [isSearching, setIsSearching] = useState(false); // 标记是否在搜索
    // 当 category 或搜索参数变化时更新 URL
    useEffect(() => {
        navigate({
            search: {
                category,
                value,
            },
        });
    }, [category, value, navigate]);
    // 分类过滤函数/节流
    const throttledOnCategory = (category) => {
        setCategory(category);
        if (listRef.current) {
            listRef.current.refetch(); // 调用子组件的 refetch 方法
        }
    }
    const handleSearchClick = () => {
        setIsSearching(true);
        if (listRef.current) {
            listRef.current.refetch().then(() => {
                setIsSearching(false);
            })
                .catch((err) => {
                    console.error(err);
                    setIsSearching(false);
                });// 调用子组件的 refetch 方法
        }
    };

    return (
        <div>
            <Suspense fallback={<div>Suspense Input  Loading...</div>}>
                <Input
                    value={value}
                    setValue={setValue}
                    onInputClick={handleSearchClick}
                    isSearching={isSearching}
                />
            </Suspense>
            <Suspense fallback={<div>Suspense Category Loading...</div>}>
                {/* 分类筛选 */}
                <Category
                    category={category}
                    onSearchClick={throttledOnCategory}
                ></Category>
            </Suspense>
            <div style={{ display: 'flex' }}>
                <div>
                    <Suspense fallback={<div>Suspense Lists Loading...</div>}>
                        <Lists ref={listRef} category={category} value={value}></Lists>
                    </Suspense>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

