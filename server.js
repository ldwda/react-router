
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';



const app = express();
const PORT = 5000; // 端口号

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟数据
const posts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `This is the body of post ${i + 1}.`,
    category: `Category ${i % 3}`,
}));

// API 路由

// 获取列表（支持分页、分类和模糊查询）
app.get('/api/posts', (req, res) => {
    const { page = 1, pageSize = 10, query = '', category = 'all' } = req.query;
    // 过滤数据
    let filteredPosts = posts.filter(
        (post) =>
            (!query || post.title.toLowerCase().includes(query.toLowerCase())) &&
            (category == 'all' || post.category === category)
    );

    // 分页
    const startIndex = (page - 1) * pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + parseInt(pageSize, 10));

    res.json({
        data: paginatedPosts,
        total: filteredPosts.length,
        hasNextPage: page * pageSize < filteredPosts.length,
        page: page
    });
});

// 获取单个详情
app.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => p.id === parseInt(id, 10));

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
