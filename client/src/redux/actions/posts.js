import { Toast } from "antd-mobile";
import * as api from "../../api";
import { LIVE_POST_CHANGE, USERS_POSTS_ADD_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_POST_COMMENT_STATE_CHANGE, USERS_POST_LIKE_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants";
import { sendNotification } from "./user";

export const getPost = (id) => async (dispatch) => {
    try {
        // dispatch({ type: START_LOADING });
        const { data } = await api.fetchPost(id);
        dispatch({
            type: USERS_POSTS_ADD_CHANGE,
            data: data
        });
        dispatch({ type: LIVE_POST_CHANGE, data: data })
        // dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
};

export const getPosts = () => async (dispatch) => {
    try {
        // dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts();
        dispatch({
            type: USERS_POSTS_STATE_CHANGE,
            data: data
        });
        // dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error.message);
    }
};


export const getUserPosts = (postUid) => async (dispatch) => {
    try {
        const { data: curPosts } = await api.fetchUserPosts(postUid)
        dispatch({ type: USER_POSTS_STATE_CHANGE, data: curPosts })

    } catch (error) {
        console.log(error.message);
    }
};


export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({
            type: USERS_POSTS_ADD_CHANGE,
            data: data
        });
    } catch (error) {
        console.log(error);
    }
};


export const createPost = (post, navigate) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);
        dispatch({
            type: USERS_POSTS_ADD_CHANGE,
            data: data
        });

        Toast.clear()
        Toast.show({
            icon: 'success',
            content: '发布成功',
            duration: 2000,
        })
        navigate('/home/homeIndex')
    } catch (error) {
        console.log(error);
    }
};

export const commentPost = (postId, userId, value, userWs, notification) => async (dispatch) => {
    try {
        const { data } = await api.commentPost(postId, value)
        dispatch({
            type: USERS_POSTS_ADD_CHANGE,
            data: data
        });
        dispatch({ type: LIVE_POST_CHANGE, data: data })

        if(notification){
            const comments = data.comments
            notification.relatedCommentId = comments[0]._id
            dispatch(sendNotification(userId, userWs, notification))
        }


    } catch (error) {
        console.log(error);
    }
};