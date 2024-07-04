import { Avatar, Button, Input, Mask, SearchBar, Toast } from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AutoSizer, List } from 'react-virtualized'
import { changeFollowingUsersAction } from '../../../redux/actions'
import './index.scss'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MinusOutline } from 'antd-mobile-icons'
import * as api from '../../../api'
import { USERS_ADD_CHANGE, USERS_STATE_CHANGE, USER_CHATS_STATE_CHANGE } from '../../../redux/constants'


function Share(props) {

  const [chatList, setChatList] = useState(props.chats)
  const [shareText, setShareText] = useState('')
  const { currentUser, users, chats, changeFollowingUsersAction, post } = props
  const [selectedChats, setSelectedChats] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(async () => {
    const { data: chats } = await api.fetchChats()
    dispatch({ type: USER_CHATS_STATE_CHANGE, data: chats })

  }, [])

  useEffect(async () => {
    const newChats = props.chats.map(async (chat) => {
      let otherUserId
      if (chat.users[0] === currentUser._id) {
        otherUserId = chat.users[1]
      }
      else {
        otherUserId = chat.users[0]
      }
      const otherUser = props.users.find(item => item.uid === otherUserId)

      if (otherUser === undefined) {
        const { data: newUser } = await api.getUser(otherUserId)
        dispatch({ type: USERS_ADD_CHANGE, data: newUser })
        return { ...chat, otherUser: newUser }
      }
      else {
        return { ...chat, otherUser }
      }
    })

    setChatList(newChats)


  }, [props.users, props.chats])



  function onClickSend(chat) {
    const { _id } = chat
    if (selectedChats.includes(_id)) {
      setSelectedChats(selectedChats.filter((id) => id !== _id))
    }
    else {
      setSelectedChats((prev) => [...prev, _id])
    }
  }

  async function onShareFinish() {

    for (let i = 0; i < selectedChats.length; i++) {
      const id = selectedChats[i]
      const msgPost = {
        content: JSON.stringify({
          id: post._id,
          url: post.imageURL,
          avatar: post.user.avatr,
          username: post.user.username,
          caption: post.caption
        }),
        type: 3
      }

      await api.sendMsg(id, msgPost)

      if (shareText.trim() !== '') {
        const msgTxt = {
          content: shareText,
          type: 0,
        }
        await api.sendMsg(id, msgTxt)
      }
    }

    setSelectedChats([])

    Toast.show({
      icon: 'success',
      content: '分享成功',
    })
  }


  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) {
    if (chatList.length > 0) {
      const chat = chatList[index]
      const { otherUser, lastMessage } = chat  // : { image, username }
      const isShared = selectedChats.includes(chat._id)
      return (
        <div key={key} style={style} className='chat-item'>
          <div className="left">
            <Avatar src={otherUser?.avatar} style={{ '--border-radius': '100%' }} />
            <div className="caption">
              <p className='name'><b>{otherUser?.username}</b></p>
              <p className='lastChat'>{lastMessage}</p>
            </div>
          </div>

          <Button
            size='small'
            className={isShared ? 'sharedBtn' : 'btn'}
            onClick={() => onClickSend(chat)}
          >
            {
              isShared ? '撤销' : '发送'
            }
          </Button>
        </div>
      );
    }

  }



  return (
    <Mask opacity='thin' onMaskClick={() => navigate(-1)}>
      <div className='share'>
        <div className="mark"></div>

        <div className="share-header">
          <img src={post?.imageURL} alt="" className='postImg' />
          <Input placeholder='请输入内容' clearable onChange={value => setShareText(value)} />
        </div>

        <div className="share-search">
          <SearchBar placeholder='搜索用户' />
        </div>

        {/* <div> */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={300}
              rowCount={chatList.length}
              rowHeight={60}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
        {/* </div> */}

        <Button
          className='share-finishBtn'
          disabled={selectedChats.length > 0 ? false : true}
          onClick={onShareFinish}
        >
          完成
        </Button>
      </div>
    </Mask>


  )
}


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  users: store.usersState.users,
  chats: store.userState.chats
})


export default connect(mapStateToProps, null)(Share)
