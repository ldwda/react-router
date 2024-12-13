import http from './require.js';

const API_URL = 'http://localhost:5000/api';

// 获取列表
export const fetchLists = async (params) => {
    return http({
        method: 'GET',
        url: `${API_URL}/posts`,
        params
    })
};

// 获取详情
export const fetchPostById = async (id) => {
    console.log(1);
    await new Promise(resolve => setTimeout(resolve, 4000));
    console.log(2);
    return http({
        method: 'GET',
        url: `${API_URL}/posts/${id}`,
        params: { id },
    })
};