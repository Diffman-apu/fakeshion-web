import React, { forwardRef, useContext, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'
import { Button, Modal } from 'antd-mobile'
import { likePost } from '../../../../redux/actions/posts'
import { followUser, sendNotification } from '../../../../redux/actions/user'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'
import { userWsContext } from '../../../../App'

const PostFeeds = forwardRef((props, gridRef) => {

    const navigate = useNavigate()
    const { data: feeds, userId, pathName} = props

    const userWs = useContext(userWsContext)
    const dispatch = useDispatch()

    // 当点击【点赞】按钮时
    function onPressLike(post) {
        if (!props.currentUser) {
            Modal.alert({
                title: '提示',
                content: (
                    <>
                        <div>当前状态未登录，点击去<Link to={'/login'}>登录</Link></div>
                    </>
                ),
                closeOnMaskClick: true,
            })
            return;
        }

        dispatch(likePost(post._id))
        const isLiked = post.likes.includes(props.currentUser._id)
        if (!isLiked && post.creatorId !== props.currentUser._id) {
            const notification = {
                uid: post.creatorId,
                relatedUid: props.currentUser._id,
                relatedPostId: post._id,
                isRead: false,
                createTime: new Date().toISOString(),
                content: '刚刚点赞了你的作品~',
                type: 'like'
            }
            dispatch(sendNotification(post.creatorId, userWs, notification))
        }

    }


    // 点击 【分享】按钮时
    function onShareClick(post) {
        if (!props.currentUser) {
            Modal.alert({
                title: '提示',
                content: (
                    <>
                        <div>当前状态未登录，点击去<Link to={'/login'}>登录</Link></div>
                    </>
                ),
                closeOnMaskClick: true,
            })
            return;
        }
        // setIsVisibleShare(true)
        // setSelectedPost(post)
    }

    // 点击【评论】按钮时
    function onCommentClick(post) {
        if (!props.currentUser) {
            Modal.alert({
                title: '提示',
                content: (
                    <>
                        <div>当前状态未登录，点击去<Link to={'/login'}>登录</Link></div>
                    </>
                ),
                closeOnMaskClick: true,
            })
            return;
        }
        const path = pathName.split('/').splice(1,2).join('/')
        navigate(`/${path}/comments/${post._id}`)
    }


    // 点击【关注】或 【取消关注】 按钮
    function onFollow(user, isFollowed) {
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


    const cache = new CellMeasurerCache({
        defaultHeight: 300,
        // minWidth: 75,
        fixedWidth: true
    });

    function rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
        parent,
    }) {
        const post = feeds[index]
        const isLiked = props.currentUser ? post?.likes?.includes(props.currentUser._id) : false
        const isFollowed = props.currentUser ? props.followings?.includes(post?.creatorId) : false
        
        const curTs = new Date(new Date().toISOString()).getTime()
        const lastMsgTs = new Date(post?.createTime).getTime()
        const timeStr = timeDifference(lastMsgTs, curTs)
        return (
            post &&
            <CellMeasurer
                cache={cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                <div className={`item ${post._id}`} key={post._id} style={style}>
                    {/* post 头部 */}
                    <div className={`item-header ${post.user?._id}`}>
                        <Link to={`/home/otherProfile/${post.user?._id}`} className='header-link link'>
                            <img src={post.user?.avatar} alt="avatar" className='item-avatar' />
                            <h3>{post.user?.username}</h3>
                        </Link>
                        <div className="right">
                            {
                                !userId &&
                                <Button
                                    className={`action-btn ${isFollowed ? 'followedBtn' : 'unFollowedBtn'}`}
                                    onClick={() => onFollow(post.user, isFollowed)}
                                    fill={isFollowed ? 'outline' : 'solid'}
                                    color='primary'
                                    size='small'
                                >
                                    {isFollowed ? '已关注' : '关注'}
                                </Button>
                            }

                            <i className='iconfont icon-gengduo-shuxiang' />
                        </div>
                    </div>

                    {/* post 图片区域 */}
                    <img src={post.imageURL} alt="##" className='item-img' />

                    <div className="item-footer">
                        {/* post 点赞等互动区 */}
                        <div className="item-actions">
                            <i
                                className={`iconfont ${isLiked ? 'icon-heart-fill' : 'icon-heart'}`}
                                onClick={() => onPressLike(post)}>
                            </i>

                            <i className='iconfont icon-comment ' onClick={() => onCommentClick(post)}></i>
                            <i className='iconfont icon-share1 ' onClick={() => onShareClick(post)} ></i>

                            <p className='likes'><b>{post.likesCount} likes</b></p>

                        </div>

                        {/* post 正文介绍区 */}
                        <div className="item-caption">
                            <Link to={'/home/homeSearch'} className='link' ><b className='author'>Paul</b></Link>&nbsp;
                            <span>{post.caption}</span>
                        </div>

                        {/* post 评论区 */}
                        <div className="item-comment">
                            <p className='comment-btn' onClick={() => onCommentClick(post)}>View more {post.commentsCount} comments</p>
                            <p className='time-ago'><span>{timeStr}</span></p>
                        </div>

                    </div>

                </div>
            </CellMeasurer>

        )
    }


    return (
        <div className="post-feeds">
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={feeds.length}
                        rowHeight={(param) => cache.rowHeight(param) + 5}
                        ref={gridRef}
                        scrollToAlignment='start'
                        rowRenderer={rowRenderer}
                        deferredMeasurementCache={cache}
                    />
                )} 
            </AutoSizer>
        </div>
    )
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    feeds: store.usersState.feeds,
    users: store.usersState.users,
    unreadNotifyCnt: store.userState.unreadNotifyCnt,
    followings: store.userState.followings,
})


export default connect(mapStateToProps, null, null, { forwardRef: true })(PostFeeds)