import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CloseOutline, CheckOutline, RightOutline, UploadOutline } from 'antd-mobile-icons'
import { NavBar, TextArea, Toast } from 'antd-mobile'
import './index.scss'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../libs/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { connect, useDispatch } from 'react-redux'
import { createPost } from '../../../redux/actions/posts'



function Save(props) {
    const { state: { url } } = useLocation()
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const dispatch = useDispatch()


    async function onChecked() {
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
        // Toast.show({
        //     icon: <UploadOutline />,
        //     content: '上传中',
        //     duration: 0,
        // })
        dispatch(createPost(newPost, navigate))
        

        // const response = await fetch(url)
        // const blob = await response.blob()

        // const storageRef = ref(getStorage(), `/postCreations/${Date.now()}.jpg`)
        // const uploadTask = uploadBytesResumable(storageRef, blob);

        
        // uploadTask.on(
        //     "state_changed",
        //     (snapshot) => { },
        //     (error) => { console.log(error); },
        //     () => {
        //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //             let obj = {
        //                 downloadURL,
        //                 caption: text,
        //                 likesCount: 0,
        //                 commentsCount: 0,
        //                 type: 0,
        //                 createTime: serverTimestamp()
        //             }
        //             const collectionRef = collection(doc(db, 'posts', getAuth().currentUser.uid), 'userPosts')
        //             addDoc(collectionRef, obj).then((result) => {
        //                 Toast.clear()
        //                 Toast.show({
        //                     icon: 'success',
        //                     content: '发布成功',
        //                 })
        //                 navigate(`/home/homeProfile/${getAuth().currentUser.uid}`)
        //             })
        //             console.log('post上传成功！！！！');
        //         }
        //         );

        //     })


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

