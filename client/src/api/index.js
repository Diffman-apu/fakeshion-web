import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const parsedProfile = JSON.parse(profile);
        const token = parsedProfile.token || parsedProfile.credential;
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }
    return req;
});

export const fetchPost = async (id) => await API.get(`/posts/${id}`);
export const fetchPosts = async () => await API.get('/posts/all');
export const fetchUserPosts = async (id) => await API.get(`/posts/${id}/all`);
export const fetchPostBySearch = async (searchQuery) => await API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = async (newPost) => await API.post('/posts', newPost);
export const updatePost = async (id, updatedPost) => await API.patch(`/posts/${id}`, updatedPost);
export const deletePost = async (id) => await API.delete(`/posts/${id}`);
export const likePost = async (id) => await API.patch(`/posts/${id}/likePost`);
export const commentPost = async (id, value) => await API.post(`/posts/${id}/commentPost`, { value });

export const fetchChat = async (id) => await API.get(`/chats/${id}`);
export const fetchChats = async () => await API.get('/chats/all');
export const shareChat = async (id, messages) => await API.post(`/chats/${id}`, messages);
export const sendMsg = async (id, message) => await API.post(`/chats/${id}`, message);

export const fetchNotifications = async () => await API.get('/notifications/all');
export const sendNotification = async (notification) => await API.post('/notifications/', notification);
export const updateNotification = async (id, notification) => await API.post(`/notifications/${id}`, notification);

export const fetchSearchKeys = async () => await API.get('/search/keys');
export const getAvatarsBySearch = async (value) => await API.get(`/search/avatars/${value}`);
export const getDetailsBySearch = async (value) => await API.get(`/search/details/${value}`);
export const updateSearchKeys = async (key) => await API.post('/search/keys/update', key);
export const deleteSearchKey = async (id) => await API.delete(`/search/keys/${id}`);


export const signIn = async (formData) => await API.post('/user/signIn', formData);
export const signUp = async (formData) => await API.post('/user/signUp', formData);
export const getUser = async (id) => await API.get(`/user/${id}`);
export const getUsers = async () => await API.get('/user/all');
export const followUser = async (id) => await API.patch(`/user/${id}/follow`);
