import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CloseOutline, CheckOutline, RightOutline, UploadOutline } from 'antd-mobile-icons'
import { NavBar, TextArea, Toast } from 'antd-mobile'
import './index.scss'
import { connect, useDispatch } from 'react-redux'
import { createPost } from '../../../redux/actions/posts'



function Save(props) {
    const { state: { url } } = useLocation()
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const dispatch = useDispatch()


    function onChecked() {
        if(text.trim()===''){
            Toast.show({
                content: '文案内容为空，请继续输入~',
                duration: 2000,
            })
            return;
        }
        const newPost = {
            caption: text,
            imageURL: url,
            type: 0,
            creatorId: props.currentUser._id,
        }
    
        dispatch(createPost(newPost, navigate))
    }


    return (
        <div className='save'>
            <NavBar onBack={() => navigate(-1)} right={<CheckOutline onClick={onChecked} />}>新帖子</NavBar>
            <div className="body">
                <img src={url} alt="" className='postImg' />
                <TextArea
                    placeholder='输入发布内容...'
                    showCount
                    maxLength={300}
                    value={text}
                    onChange={val => setText(val)}
                />
            </div>
            <div className="footer">
                <div className="option">标记用户</div>
                <div className="option">添加地点</div>
            </div>
        </div>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    users: store.usersState.users,
    currentPost: store.usersState.currentPost
  })
  
  
  export default connect(mapStateToProps, null)(Save)

