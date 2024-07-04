import React, { useContext, useEffect, useState } from 'react'
import './index.scss'
import { Button, Grid, Skeleton } from 'antd-mobile'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeUserAction, changeUserPostsAction } from '../../../redux/actions'
import * as api from '../../../api'
import { USERS_ADD_CHANGE, USER_FOLLOWINGS_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from '../../../redux/constants'
import Login from '../../Auth/Login'
import { TypeMap, stringify } from '../../../util'
import { userWsContext } from '../../../App'
import { getUserPosts } from '../../../redux/actions/posts'
import { followUser, getUser, sendNotification } from '../../../redux/actions/user'

const map = new TypeMap().map;

function HomeProfile(props) {
    const [user, setUser] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [postType, setPostType] = useState(0)  // 0:image, 1:video

    const userId = props.currentUser?._id
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userWs = useContext(userWsContext)

    useEffect(() => {
        if (userId) {
            dispatch(getUserPosts(userId))
        }
    }, [userId])

    useEffect(() => {
        if(props.userPosts){
            const morePosts = [...props.userPosts, ...props.userPosts, ...props.userPosts, 
                                ...props.userPosts, ...props.userPosts, ...props.userPosts]
            const newPosts = morePosts.filter((item)=>item.type === postType)
            setUserPosts(newPosts)
        }
    }, [props.userPosts, postType])

    useEffect(() => {
        if (userId) {
            const newUser = props.users.find((item) => item._id === userId)
            if (!newUser) {
                dispatch(getUser(userId))
            }
            else {
                const isFollowed = props.followings?.includes(userId)
                setUser({ ...newUser, isFollowed })
            }
        }

    }, [props.users, userId, props.followings])

    // 点击【关注】或 【取消关注】 按钮
    function onFollow(user) {
        if (!props.currentUser) {
            navigate('/login')
        }
        dispatch(followUser(user._id))

        if (!user.isFollowed) {
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

    function onClickPost(index, post) {
        navigate(`/home/userPosts/${user._id}`, { state: { postId: post._id } })
    }

    if (!userId) {
        return (
            <div className="pageNotExist">
                <p>当前状态未登录，请登录~</p>
                <Login />
            </div>
        )
    }

    function onSwitchBar(type) {
        setPostType(type)
    }

    return (
        user &&
        <div className='profile'>
            <div className="profile-header">
                <span className='username'>{user?.username}</span>
                <div className="right">
                    <i className='iconfont icon-tianjia'></i>
                    <i className='iconfont icon-caidan'></i>
                </div>

            </div>

            <div className="profile-body">
                <div className="basic">
                    <img src={user?.avatar} alt="avatar" className='basic-avatar' />
                    <div className="post basic-item">
                        <span>{userPosts?.length}</span>
                        <p>作品</p>
                    </div>
                    <div className="fan basic-item">
                        <span>{user?.followerCount}</span>
                        <p>粉丝</p>
                    </div>
                    <div className="following basic-item">
                        <span>{user?.followingCount}</span>
                        <p>关注</p>
                    </div>
                </div>

                <div className="caption">
                    {/* <p className='desc'><b>{user?.username}</b></p> */}
                    <p>{user?.description}</p>
                </div>

                <div className="middle">
                    <span className='btn'>编辑主页</span>
                    <span className='btn'>分享主页</span>
                    <i className='iconfont icon-tianjiayonghu'></i>
                </div>
            </div>


            <div className="navBar">
                <i className={`iconfont icon-duotu ${postType === 0? 'selectedType':''}`} onClick={() => onSwitchBar(0)}></i>
                <i className={`iconfont icon-shipin ${postType === 1? 'selectedType':''}`} onClick={() => onSwitchBar(1)}></i>
            </div>
            <Grid columns={3} gap={3}>
                {
                    userPosts.length > 0 && userPosts.map((post, index) => (
                        <Grid.Item className='grid-item' key={index} onClick={() => onClickPost(index, post)}>
                            <img src={post.imageURL} alt="" className='grid-img' />
                        </Grid.Item>
                    ))
                }
            </Grid>
        </div>
    )
}

const mapStateToProps = (store) => (
    {
        currentUser: store.userState.currentUser,
        followings: store.userState.followings,
        users: store.usersState.users,
        userPosts: store.userState.userPosts
    })


export default connect(mapStateToProps, null)(HomeProfile)
