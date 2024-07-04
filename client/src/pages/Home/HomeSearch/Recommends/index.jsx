import React from 'react'
import './index.scss'
import { Grid } from 'antd-mobile'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function RecommendFeeds(props) {

    const navigate = useNavigate()
    function onClickPost(post){
        navigate('/home/recommendPosts', {state:{postId: post._id}})
    }
    
    return (
        <Grid columns={3} gap={3}>
            {
                props.feeds.length > 0 && props.feeds.concat(props.feeds, props.feeds).map((post, index) => (
                    <Grid.Item className='grid-item' key={index} onClick={()=>onClickPost(post)}>
                        <img src={post.imageURL} alt="" className='grid-img' />
                    </Grid.Item>
                ))
            }
        </Grid>
    )
}


const mapStateToProps = (store) => ({
    feeds: store.usersState.feeds,
    // recentSearches: store.userState.recentSearches,
    // users: store.usersState.users,
    // curSimplesBySearch: store.userState.curSimplesBySearch,
    // curDetailsBySearch: store.userState.curDetailsBySearch,
})
export default connect(mapStateToProps, null)(RecommendFeeds)
