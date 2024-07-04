import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Input, NavBar, Space } from 'antd-mobile'
import { connect, useDispatch } from 'react-redux'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized'
import * as api from '../../../api'
import { USERS_ADD_CHANGE, USERS_STATE_CHANGE, USER_CHAT_STATE_CHANGE } from '../../../redux/constants'
import { userWsContext } from '../../../App'
import { RetinaRegex, TypeMap, stringify, timeFmtForMsg } from '../../../util'
import { getChat, sendMsg } from '../../../redux/actions/chats'
import { getUser } from '../../../redux/actions/user'
// import "emoji-mart/css/emoji-mart.css";
// import { Picker } from 'emoji-mart'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const map = new TypeMap().map;


function Conversation(props) {
  const { otherUserId } = useParams()
  const navigate = useNavigate()
  const userWs = useContext(userWsContext)


  const [otherUser, setOtherUser] = useState(null)
  const [chat, setChat] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [imageValue, setImageValue] = useState(null)
  const [showEmojiBox, setShowEmojiBox] = useState(false)
  const [flag, setFlag] = useState(false)
  const listContainer = useRef()
  const inputRef = useRef()
  const pickerRef = useRef()
  const fileRef = useRef()
  const emojiRef = useRef()
  const placeholderRef = useRef()
  const footerRef = useRef()
  const autoSizerRef = useRef()
  const dispatch = useDispatch()

  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA  Conversation组件执行了~~", autoSizerRef?.current?.state.height, listContainer.current)


  useEffect(() => {
    dispatch(getChat(otherUserId))
  }, [otherUserId])



  useEffect(() => {
    const otherUser = props.users.find(item => item._id === otherUserId)
    if (!otherUser) {
      dispatch(getUser(otherUserId))
    }
    else {
      setOtherUser(otherUser)
    }
  }, [props.users])


  // 获取历史消息
  useEffect(() => {
    if (props.currentChat) {
      console.log("当前 chat 为：", props.currentChat)
      const { messages, _id } = props.currentChat
      const messageList = messages.map((msg) => {
        const tag = msg.tag === 'msg'
          ? msg.creatorId === props.currentUser?._id
            ? 'myMsg'
            : 'otherMsg'
          : msg.tag

        return { ...msg, tag }
      })
      setChat({ ...props.currentChat, messages: messageList })
    }
  }, [props.currentChat, props.currentUser])


  useEffect(() => {
    console.log("BBBBBBBBBBBBBBBB listContainer发生变化了", listContainer.current)
    if (chat) {
      listContainer.current.scrollToRow(-1)
    }

  }, [chat, listContainer])

  // useEffect(()=>{
  //   if(showEmojiBox || showPlaceHolder){
  //     console.log("=========================")
  //     listContainer.current.scrollToRow(-1)
  //   }
  // },[showEmojiBox, showPlaceHolder ])


  useEffect(() => {
    console.log("CCCCCCCCCCCCCCCCCCCC", autoSizerRef?.current?.state.height)
    if(showEmojiBox && listContainer.current){
      listContainer.current.scrollToRow(-1)
    }

  }, [autoSizerRef?.current?.state.height])

  // 点击消息发送时
  function onSendText() {
    inputRef.current.clear()

    const message = {
      chatId: chat._id,
      creatorId: props.currentUser._id,
      receiverId: otherUserId,
      content: textInput,
      tag: 'msg',
      type: 'text'
    }
    dispatch(sendMsg(chat._id, userWs, message))
  }


  function onClickEmojiBtn() {
      console.log("$$$$$$$$$$$$===============", listContainer.current.Grid)
      placeholderRef.current.style.display = 'block'
      setShowEmojiBox(true)
  
  }


  function onClickOutside(event) {
    console.log("是否相等：", inputRef.current.nativeElement, event.target)
    if (!pickerRef.current?.contains(event.target) 
        && !emojiRef.current?.contains(event.target)
        && !footerRef.current?.contains(event.target)
        
      ) {
      if (showEmojiBox) {
        console.log("这里点击了",  )
        placeholderRef.current.style.display = 'none'
        setShowEmojiBox(false);
        // setShowPlaceHolder(false)
      }
    }
  }


  // 聚焦input
  const focus = () => {
    inputRef.current && inputRef.current.focus();
  }

  // 选择表情包
  const choiceEmoji = (emoji, event) => {
    event.stopPropagation();
    setTextInput(msg => `${msg}${emoji.native}`);
    // setShowEmojiBox(false);
    focus();
  }


  // 处理Retina屏幕下Chrome浏览器emoji重叠问题
  const dealEmoji = (val) => {
    if (!val) return '';
    return val.replace(RetinaRegex, (emoji) => {
      return `<span class="emoji">${emoji}</span>`;
    });
  }

  // 上传图片
  const openFile = () => {
    if (fileRef?.current) fileRef.current.click();
  }
  const choiceImage = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    if (files[0].type.indexOf('image/') === -1) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    setImageValue('');
    fileReader.onload = () => {
      const message = {
        chatId: chat._id,
        creatorId: props.currentUser._id,
        receiverId: otherUserId,
        content: fileReader.result,
        tag: 'msg',
        type: 'image'
      }
      dispatch(sendMsg(chat._id, userWs, message))
    }
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
    const messagesList = chat.messages
    if (messagesList.length > 0) {
      const message = messagesList[index]
      const { creatorId, tag, content, messageTime, type } = message
      const isMyMsg = tag === 'myMsg'
      const avatar = isMyMsg ? props.currentUser.avatar : otherUser.avatar

      let timeStr
      if (tag === 'info' && type === 'time') {
        const curTs = new Date(new Date().toLocaleDateString()).getTime()
        const lastMsgTs = new Date(content).getTime()
        timeStr = timeFmtForMsg(lastMsgTs, curTs)
      }

      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          {
            ({measure})=>(
              <div key={index} className='msg' style={style}>
              {
                tag === 'info' && <p className="info">{type === 'time' ? timeStr : content}</p>
              }
              {
                ['myMsg', 'otherMsg'].includes(tag) && (
                  <div className={isMyMsg ? 'my-msg' : 'other-msg'}>
                    {!isMyMsg && <img className="avatar-circle" src={avatar} alt="" />}
                    <ul>
                      {
                        type === 'text'
                          ? (
                            <li className={isMyMsg ? 'content my-content' : 'content'}>
                              <p className={isMyMsg ? 'triangle my-triangle' : 'triangle'}></p>
                              {/* <span>{content}</span> */}
                              <span dangerouslySetInnerHTML={{ __html: dealEmoji(content) }}></span>
                            </li>
                          )
                          : <img className="img-msg" src={content} alt="" onLoad={()=>{measure();listContainer.current.scrollToRow(-1)}} />
                      }
                    </ul>
                    {isMyMsg && <img className="avatar-circle" src={avatar} alt="" />}
                  </div>
                )
              }
              </div>
          )
          }
        </CellMeasurer>
      )
    }
  }

  return (
    <div className='conversation'>
      <div className="header">
        <NavBar back={props.unreadMsgCnt} onBack={() => navigate(-1)}>
          {otherUser?.username}
        </NavBar>
      </div>

      <div className="middle1">
        {
          chat &&
          <AutoSizer ref={autoSizerRef}>  
            {({ height, width }) => {  
              /**
               *   重要！！！
               *  问题：当点击输入框或表情按钮时，如何在表情包区域弹出同时 
               *        使对话框区域在同步上移的同时滚动对话列表至最后一行。
               *  解决思路：① 需在 autosizer 监听到可视范围变化并将变化后的height赋值给Grid后，
               *              再设置Grid的scrollTop为最后一行偏移。
               *           ② 关键在如何找到代码插入位置，因为autosizer的监听器setState()后并不会从头即root处开始beigin work,
               *              故尝试在autosizer之前的节点设置回调均不生效，这里选择在autosizer节点处设置一个异步任务，因为要等同步任务中 height传递完成：autosizer=>List=>Grid(props:{width, height})，
               *              此时 Grid的 containerSize 才是更新后的 height, 进而更新scrollToRow(-1)的scrollTop。
               */
              if(autoSizerRef.current?.state.height === 367){  
                // setTimeout(() => {
                //   listContainer.current.scrollToRow(-1)
                // });
                setFlag(true)
              }
              return (
              <List
                width={width}
                height={height}
                rowCount={chat.messages.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                ref={listContainer}
                scrollToAlignment='start'
                deferredMeasurementCache={cache}

              />
            )}}
          </AutoSizer>
        }
      </div>


      {/* {showPlaceHolder &&  */}
      <div className="middle2" ref={placeholderRef}></div>
      {/* } */}

      <div className="footer" ref={footerRef}>
        <div className="footer-top">
          <i className='iconfont icon-camera' onClick={()=>listContainer.current.scrollToRow(2)}></i>
          <i className="iconfont icon-image1" onClick={openFile}></i>
          <Input
            placeholder=' 发消息....'
            clearable
            onChange={value => setTextInput(value)}
            onEnterPress={onSendText}
            onFocus={onClickEmojiBtn}
            ref={inputRef}
            value={textInput}
          />

          <i
            className="iconfont icon-biaoqing"
            onClick={onClickEmojiBtn}
            ref={emojiRef}
          />

          <input
            ref={fileRef}
            type="file"
            name="file"
            value={imageValue}
            accept=".jpg,.jpeg,.gif,.png,.svg,.webp"
            style={{ display: "none" }}
            onChange={choiceImage}
          />

          {
            textInput &&
            <Button className='sendBtn' onClick={onSendText} size='small'>发送</Button>
          }

        </div>

        {showEmojiBox &&
          <Picker
            ref={pickerRef}
            data={data}
            categories={['people']}
            onClickOutside={onClickOutside}
            navPosition='none'
            // set='apple'
            onEmojiSelect={choiceEmoji}
            searchPosition='none'
            previewPosition='none'
            skinTonePosition='none'
            noCountryFlags='true'

          />
        }
      </div>
    </div>
  )
}


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  currentChat: store.userState.currentChat,
  chats: store.userState.chats,
  users: store.usersState.users,
  unreadMsgCnt: store.userState.unreadMsgCnt,
})

// const mapDispatchToProps = (dispatch) =>
//   (bindActionCreators({ changeFollowingUsersAction }, dispatch))

export default connect(mapStateToProps, null)(Conversation)
