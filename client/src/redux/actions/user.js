import * as api from "../../api";
import { stringify } from "../../util";
import { LIVE_NOTIFICATION_CHANGE, USERS_ADD_CHANGE, USERS_STATE_CHANGE, USER_FOLLOWINGS_STATE_CHANGE, USER_NOTIFICATIONS_STATE_CHANGE, USER_SEARCH_DETAILS_CHANGE, USER_SEARCH_KEYS_DELETE, USER_SEARCH_KEYS_STATE_CHANGE, USER_SEARCH_SIMPLES_CHANGE } from "../constants";
import { TypeMap } from "../../util";
const map = new TypeMap().map;

export const getUser = (id) => async (dispatch) => {
    try {
        const { data: newUser } = await api.getUser(id);
        dispatch({ type: USERS_ADD_CHANGE, data: newUser })
    } catch (error) {
        console.log(error.message);
    }
};


export const followUser = (id) => async (dispatch) => {
    try {
        const { data } = await api.followUser(id);
        dispatch({ type: USER_FOLLOWINGS_STATE_CHANGE, data: data.followings })
    } catch (error) {
        console.log(error.message);
    }
};


export const getUsers = () => async (dispatch) => {
    try {
        const { data } = await api.getUsers();
        dispatch({ type: USERS_STATE_CHANGE, data })
    } catch (error) {
        console.log(error.message);
    }
};


export const getNotifications = () => async (dispatch) => {
    try {
        const { data: notifications } = await api.fetchNotifications()
        dispatch({
            type: USER_NOTIFICATIONS_STATE_CHANGE,
            data: notifications,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const sendNotification = (id, ws, notification) => async (dispatch) => {
    try {
        const { data } = await api.sendNotification(notification)
        ws.send(stringify({
            type: map.get('SEND_NOTIFICATION'),
            data: data
        }))
    } catch (error) {
        console.log(error.message);
    }
};

export const updateNotification = (id, notification) => async (dispatch) => {
    try {
        const { data } = await api.updateNotification(id, notification)
        dispatch({ type: LIVE_NOTIFICATION_CHANGE, data: data })
    } catch (error) {
        console.log(error.message);
    }
};


export const getSearchKeys = () => async (dispatch) => {
    try {
        const { data: searchKeys } = await api.fetchSearchKeys()
        dispatch({
            type: USER_SEARCH_KEYS_STATE_CHANGE,
            data: searchKeys,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const updateSearchKeys = (key) => async (dispatch) => {
    try {
        const { data: searchKeys } = await api.updateSearchKeys(key)
        dispatch({
            type: USER_SEARCH_KEYS_STATE_CHANGE,
            data: searchKeys,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteSearchKey = (id) => async (dispatch) => {
    try {
        await api.deleteSearchKey(id)
        dispatch({
            type: USER_SEARCH_KEYS_DELETE,
            data: id,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const getAvatarsBySearch = (value) => async (dispatch) => {
    try {
        const { status, data: searchSimpleResults } = await api.getAvatarsBySearch(value)
        if (status === 200) {
            dispatch({
                type: USER_SEARCH_SIMPLES_CHANGE,
                data: searchSimpleResults,
            });
        }

    } catch (error) {
        console.log(error.message);
    }
};

export const getDetailsBySearch = (value) => async (dispatch) => {
    try {
        const { status, data: detailResultsBySearch } = await api.getDetailsBySearch(value)
        if (status === 200) {
            dispatch({
                type: USER_SEARCH_DETAILS_CHANGE,
                data: detailResultsBySearch,
            });
        }

    } catch (error) {
        console.log(error.message);
    }
};