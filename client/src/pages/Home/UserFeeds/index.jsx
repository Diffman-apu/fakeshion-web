import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Mask } from 'antd-mobile'
import { connect, useDispatch } from 'react-redux'
import Share from '../../Message/Share'
import Comment from '../HomeIndex/Comment'
import { userWsContext } from '../../../App'
import { followUser, getUser, sendNotification } from '../../../redux/actions/user'
import PostFeeds from '../HomeIndex/PostFeeds'


function UserFeeds(props) {
    const navigate = useNavigate()
    const {userId} = useParams()
    const { state} = useLocation()
    const [feeds, setFeeds] = useState([])
    const [user, setUser] = useState(null)
    const [isFollowed, setIsFollowed] = useState(false)
    const userWs = useContext(userWsContext)
    const gridRef = useRef()
    const dispatch = useDispatch()
    const {pathname} = useLocation()


    useEffect(() => {
        if(userId === props.currentUser?._id){
            setUser(props.currentUser)
            return
        }
        const user = props.users.find((user) => user._id === userId)
        const isFollowed = props.currentUser ? props.followings.includes(userId) : false
        setIsFollowed(isFollowed)

        if (user) {
            setUser(user)
        }
        else {
            dispatch(getUser(userId))
        }
    }, [props.users, props.followings, props.currentUser])


    useEffect(() => {
        if (props.userPosts) {
            const newFeeds = props.userPosts.map((post) => ({ ...post, user: user}))
            setFeeds(newFeeds)
        }

    }, [props.userPosts, user])


    useEffect(() => {
        if (state?.postId) {
            const idx = props.userPosts.findIndex((post) => post._id === state.postId)
            if (gridRef?.current) {
                gridRef.current.scrollToRow(idx)
            }
        }
    }, [state?.postId, props.userPosts, gridRef.current])



    // 点击【关注】或 【取消关注】 按钮
    function onFollow(user) {
        if (!props.currentUser) {
            navigate('/login')
        }
        dispatch(followUser(user._id))

        if (!isFollowed) {
            const notification = {
                uid: user._id,
                relatedUid: props.currentUser._id,
                isRead: false,
                createTime: new Date().toISOString(),
                content: '刚刚关注了你~',
                type: 'follow'
            }
            dispatch(sendNotification(user._id, userWs, notification))
        }


    }

    return (
        // 首页，包含头部 + 信息流
        <div className='user-feeds'>
            {/* 头部区域 */}
            <div className="header">
                <div className="left">
                    <i className='iconfont icon-arrow-left' onClick={() => navigate(-1)}></i>
                    <span className="side">
                        <span>帖子 from </span> 
                        <span className='username'>{user?.username}</span>
                    </span>
                </div>

                {
                    (!props.currentUser || userId!==props.currentUser._id) && 
                    <Button
                        className={`action-btn ${isFollowed ? 'followedBtn' : 'unFollowedBtn'}`}
                        onClick={() => onFollow(user)}
                        fill={isFollowed ? 'outline' : 'solid'}
                        color='primary'
                        size='small'
                    >
                        {isFollowed ? '已关注' : '关注'}
                    </Button>
                }

            </div>

            {/* 信息流推送区域 */}
            <PostFeeds data={feeds} userId={userId} ref={gridRef} pathName={pathname} />

            <Routes>
                <Route path='/comments/:postId' element={<Comment />}></Route>
                <Route path='/share/:postId' element={<Share />}></Route>
            </Routes>
        </div>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    userPosts: store.userState.userPosts,
    users: store.usersState.users,
    followings: store.userState.followings,

})


export default connect(mapStateToProps, null)(UserFeeds)
