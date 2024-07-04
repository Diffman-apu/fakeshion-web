import { Avatar, Button, Input, Mask, Modal, SearchBar, Toast } from 'antd-mobile'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'
import './index.scss'
import { connect, useDispatch } from 'react-redux'
import { timeDifference } from '../../../../util'
import { userWsContext } from '../../../../App'
import { RetinaRegex, TypeMap, stringify } from '../../../../util'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getUser, sendNotification } from '../../../../redux/actions/user'
import { commentPost, getPost } from '../../../../redux/actions/posts'



function Comment(props) {

  const { postId } = useParams()
  const { state } = useLocation()

  const [commentList, setCommentList] = useState([])
  const [post, setPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [selectedCmtId, setSelectedCmtId] = useState('')
  const inputRef = useRef()
  const commentListRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userWs = useContext(userWsContext)

  useEffect(() => {
    dispatch(getPost(postId))
  }, [postId])


  useEffect(() => {
    if (props.currentPost) {
      setPost(props.currentPost)
    }
  }, [props.currentPost])

  useEffect(() => {
    if (props.currentPost) {
      const newComments = props.currentPost.comments.map((comment) => {
        const user = props.users.find(item => item._id === comment.creatorId)
        if (user === undefined) {
          dispatch(getUser(comment.creatorId))
        }
        else {
          return { ...comment, user }
        }
      })

      setCommentList(newComments)
    }
  }, [props.users, props.currentPost])

  useEffect(() => {
    if (state && state.commentId && commentList && selectedCmtId !== 'invalid') {
      const idx = commentList.findIndex((item) => item?._id === state.commentId)
      commentListRef.current.scrollToRow(idx)

      setSelectedCmtId(state.commentId)
      setTimeout(() => {
        setSelectedCmtId('invalid')
      }, 1000);
    }
  }, [state?.commentId, commentList])


  function onCommentSend() {
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

    if (commentText.length < 1) {
      Toast.show({
        content: '评论内容为空，请继续输入~',
        duration: 2000,
      })
      return;
    }

    const notification = 
          props.currentUser._id === post.creatorId
            ? null
            : {
              uid: post.creatorId,
              relatedUid: props.currentUser._id,
              relatedPostId: post._id,
              // relatedCommentId: comments[comments.length - 1]._id,
              isRead: false,
              createTime: new Date().toISOString(),
              content: '刚刚评论了你的作品~',
              type: 'comment'
            }
            
    dispatch(commentPost(post._id, post.creatorId, commentText, userWs, notification))

    // dispatch(sendNotification(post.creatorId, userWs, notification))

    setCommentText('')
    commentListRef.current.scrollToRow(0)
  }

  function onReply(username) {
    setCommentText(`@${username} `)
    inputRef.current.focus()
  }

  const cache = new CellMeasurerCache({
    defaultHeight: 100,
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
    if (commentList.length > 0) {
      const comment = commentList[index]
      if (!comment) return ''
      const { _id, user, text, createTime } = comment  // : { image, username }
      const createTimeStamp = createTime?.seconds * 1000 + createTime?.nanoseconds / 1000 / 1000
      const timeDiff = timeDifference(new Date().getTime(), new Date(createTime).getTime())

      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          <div key={key} style={style} className={`comment-item ${selectedCmtId === _id ? 'selectedCmt' : ''}`}>
            <Avatar src={user?.avatar} style={{ '--border-radius': '100%' }} />
            <div className="caption">
              <p className='username'><b>{user?.username}</b></p>
              <span className='content'>{text}</span>
              <p className='caption-footer'>
                <span>{timeDiff}</span>&nbsp;&nbsp;
                <span onClick={() => onReply(user.username)}>回复</span>
              </p>
            </div>
            <div className="right">
              <i className='iconfont icon-heart'></i>
              <p>138</p>
            </div>

          </div>
        </CellMeasurer>

      );
    }

  }


  return (
    <Mask opacity='thin' onMaskClick={()=>navigate(-1)}>
      <div className='comment'>
        <div className="roll-up"></div>

        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={380}
              rowCount={commentList.length}
              rowHeight={cache.rowHeight}
              ref={commentListRef}
              scrollToAlignment='start'
              rowRenderer={rowRenderer}
              deferredMeasurementCache={cache}
            />
          )}
        </AutoSizer>

        <div className="footer">
          <img src={props.currentUser.avatar} alt="" className='avatar' />

          <Input
            placeholder='输入评论....'
            clearable
            onChange={value => setCommentText(value)}
            onEnterPress={onCommentSend}
            ref={inputRef}
            value={commentText}
          />
          <Button className='sendBtn' onClick={onCommentSend} >发送</Button>
        </div>

      </div>
    </Mask>


  )
}


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  users: store.usersState.users,
  currentPost: store.usersState.currentPost
})


export default connect(mapStateToProps, null)(Comment)
