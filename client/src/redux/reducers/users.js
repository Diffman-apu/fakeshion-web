import { USERS_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_POST_LIKE_STATE_CHANGE, USERS_POST_COMMENT_STATE_CHANGE, USER_LOGOUT, USERS_POST_ATTR_STATE_CHANGE, USERS_ADD_CHANGE, LIVE_POST_CHANGE, USERS_POSTS_ADD_CHANGE } from "../constants";

const initState = {
    users: [],
    feeds: [],
    currentPost: null
}
export function usersReducer(preState = initState, action) {
    const { type, data } = action

    switch (type) {
        case USER_LOGOUT:
            return initState
        case USERS_STATE_CHANGE:
            return { ...preState, users: [...preState.users, ...data] }
        case USERS_ADD_CHANGE:
            const idx = preState.users.findIndex((item) => item._id === data._id)
            if (idx > -1) {
                const newUsers = preState.users.map((user) => user._id === data._id ? data : user)
                return { ...preState, users: newUsers }
            }
            else {
                return { ...preState, users: [...preState.users, data] }
            }

        case USERS_POSTS_STATE_CHANGE:
            return { ...preState, feeds: data }

        case USERS_POSTS_ADD_CHANGE:
            const idx2 = preState.feeds.findIndex((item) => item._id === data._id)
            if (idx2 > -1) {
                const newFeeds = preState.feeds.map(post => (
                    post._id === data._id ? data : post
                ))
                return { ...preState, feeds: newFeeds }
            }
            else {
                return { ...preState, feeds: [...preState.feeds, data] }
            }
        case LIVE_POST_CHANGE:
            return {...preState, currentPost: data}
        case USERS_POST_COMMENT_STATE_CHANGE:
            return {
                ...preState, feeds: preState.feeds.map(post => (
                    post._id === data._id
                        ? data
                        : post
                )
                )
            }
        case USERS_POST_ATTR_STATE_CHANGE:
            return {
                ...preState, feeds: preState.feeds.map(post => (
                    post.id === data.id
                        ? { ...post, ...data }
                        : post
                )
                )
            }
        default:
            return preState;
    }
}