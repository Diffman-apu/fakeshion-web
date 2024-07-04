import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWINGS_STATE_CHANGE, USER_CHATS_STATE_CHANGE, USER_CHAT_STATE_CHANGE, LIVE_MESSAGE_CHANGE, LIVE_NOTIFICATION_CHANGE, USER_NOTIFICATIONS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USER_UNREAD_NOTIFY_CNT_CHANGE, USER_UNREAD_MSG_CNT_CHANGE, USER_SEARCH_KEYS_STATE_CHANGE, USER_SEARCH_SIMPLES_CHANGE, USER_SEARCH_DETAILS_CHANGE, USER_SEARCH_INPUT_CHANGE, USER_SEARCH_KEYS_DELETE } from "../constants";

const initState = {
    currentUser: null,
    followings: [],
    currentChat: null,
    userPosts: [],
    followings: [],
    chats: [],
    notifications: [],
    liveMessage: null,
    unreadMsgCnt: 0,
    unreadNotifyCnt: 0,
    recentSearches: [],
    curSimplesBySearch: [],
    curDetailsBySearch: [],
    liveSearchInput: null,

}

export function userReducer(preState = initState, action) {
    const { type, data } = action
    switch (type) {
        case USER_STATE_CHANGE:
            if (!data) {
                return { ...preState, currentUser: data }
            }
            return { ...preState, currentUser: data, followings: data ? data.followings : [] }

        case USER_POSTS_STATE_CHANGE:
            return { ...preState, userPosts: data }
        case USER_SEARCH_KEYS_STATE_CHANGE:
            return { ...preState, recentSearches: data }
        case USER_SEARCH_KEYS_DELETE:
            if (data === 'all') {
                return { ...preState, recentSearches: [] }
            }
            else {
                const newArr = preState.recentSearches.filter((item) => item._id !== data)
                return { ...preState, recentSearches: newArr }
            }

        case USER_SEARCH_SIMPLES_CHANGE:
            return { ...preState, curSimplesBySearch: data }
        case USER_SEARCH_DETAILS_CHANGE:
            return { ...preState, curDetailsBySearch: data }
        case USER_SEARCH_INPUT_CHANGE:
            return { ...preState, liveSearchInput: data }

        case USER_CHATS_STATE_CHANGE:
            return { ...preState, chats: data }
        case USER_NOTIFICATIONS_STATE_CHANGE:
            return { ...preState, notifications: data }
        case USER_CHAT_STATE_CHANGE:
            const idx4 = preState.chats.findIndex((item) => item._id === data._id)
            if (idx4 > -1) {
                const newChats = preState.chats.filter((item) => item._id !== data._id)
                newChats.push(data)

                return { ...preState, chats: newChats, currentChat: data }
            }
            else {
                return { ...preState, chats: [...preState.chats, data], currentChat: data }
            }

        case USER_FOLLOWINGS_STATE_CHANGE:
            console.log("reducer中添加 userFollowings")
            return { ...preState, followings: data }
        case USER_FOLLOWING_STATE_CHANGE:
            const idx = preState.followings.findIndex((item) => item._id === data._id)
            if (idx > -1) {
                const newList = preState.followings.filter((item) => item._id !== data._id)
                newList.push(data)
                return { ...preState, followings: newList }
            }
            else {
                return { ...preState, followings: [...preState.followings, data] }
            }

        case LIVE_MESSAGE_CHANGE:
            const { newChat, newMsg } = data
            // let newChat = preState.currentChat
            // if(data.chatId === preState.currentChat?._id){
            //     const newMessages = preState.currentChat.messages
            //     newChat = { ...preState.currentChat, messages: [...newMessages, data] }
            //     return { ...preState, liveMessage: data, currentChat: newChat }
            // }
            return { ...preState, liveMessage: newMsg, currentChat: newChat }
        case LIVE_NOTIFICATION_CHANGE:
            const idx5 = preState.notifications.findIndex((item) => item._id === data._id)
            if (idx5 > -1) {
                const newList = preState.notifications.map((item) => item._id === data._id ? data : item)
                return { ...preState, notifications: newList }
            }
            else {
                return { ...preState, liveMessage: data, notifications: [data, ...preState.notifications] }

            }
        case USER_UNREAD_MSG_CNT_CHANGE:
            return { ...preState, unreadMsgCnt: data }
        case USER_UNREAD_NOTIFY_CNT_CHANGE:
            return { ...preState, unreadNotifyCnt: data }

        default:
            return preState;
    }
}