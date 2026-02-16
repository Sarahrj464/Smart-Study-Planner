import apiClient from '../api/apiClient';

export const blogService = {
    getBlogs: async () => {
        const response = await apiClient.get('/blogs');
        return response.data;
    },
    getBlog: async (id) => {
        const response = await apiClient.get(`/blogs/${id}`);
        return response.data;
    },
    createBlog: async (blogData) => {
        const response = await apiClient.post('/blogs', blogData);
        return response.data;
    },
    updateBlog: async (id, blogData) => {
        const response = await apiClient.put(`/blogs/${id}`, blogData);
        return response.data;
    },
    deleteBlog: async (id) => {
        const response = await apiClient.delete(`/blogs/${id}`);
        return response.data;
    }
};
