import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import PostFeeds from '../../../HomeIndex/PostFeeds'
import { getUser } from '../../../../../redux/actions/user'
import Comment from '../../../HomeIndex/Comment'
import Share from '../../../../Message/Share'
import { userWsContext } from '../../../../../App'


function RecommendFeeds(props) {
    const {state} = useLocation()
    const navigate = useNavigate()
    const [feeds, setFeeds] = useState(props.feeds)
    const gridRef = useRef()
    const dispatch = useDispatch()
    const {pathname} = useLocation()
    console.log("BBBBBBBBBBBBB", useLocation())



    useEffect(()=>{
        if(state && state.postId){
            const idx = props.feeds.findIndex((post)=>post._id === state.postId)
            
            if(idx>-1 && gridRef.current){
                console.log("bbbbbbbbbbbbbbb ", gridRef)
                gridRef.current.scrollToRow(idx)
            }
        }
    },[props.feeds, state?.postId, gridRef.current])

    useEffect(() => {
        if (props.feeds && props.users) {
            const newFeeds = props.feeds?.map((post) => {
                const user = props.users?.find((user) => user._id === post.creatorId)

                if (user === undefined) {
                    console.log("MMMMMMMM", post)
                    dispatch(getUser(post.creatorId))
                }
                else {
                    return { ...post, user }
                }
            })
            console.log("XXXXX RecommendFeeds 中 newFeeds:", newFeeds)
            setFeeds(newFeeds)
        }

    }, [props.feeds, props.users])


    return (
        // 首页，包含头部 + 信息流
        <div className='recommend-feeds'>
            {/* 头部区域 */}
            <div className="header">
                <i className='iconfont icon-arrow-left' onClick={() => navigate(-1)}></i>
                <span className='title'>发现</span>
            </div>


            {/* 信息流推送区域 */}
            <PostFeeds data={feeds} ref={gridRef} pathName={pathname} />

            <Routes>
                <Route path='/comments/:postId' element={<Comment />}></Route>
                <Route path='/share/:postId' element={<Share />}></Route>
            </Routes>
        </div>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    feeds: store.usersState.feeds,
    users: store.usersState.users,
    unreadNotifyCnt: store.userState.unreadNotifyCnt,
    followings: store.userState.followings,
})


export default connect(mapStateToProps, null)(RecommendFeeds)
