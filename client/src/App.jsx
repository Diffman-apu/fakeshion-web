import Home from './pages/Home';
import Message from './pages/Message/Share';
import Camera from './pages/Camera';

import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import { changeLikeOfCurUserToPostAction, changePostsOfFollowingUsersAction, changeUserAction, changeUserChatsAction, changeUserFollowingsAction, changeUserPostsAction } from './redux/actions';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Share from './pages/Message/Share';
import Conversation from './pages/Message/Conversation';
import Save from './pages/Camera/Save';
import Shot from './pages/Camera/Shot';
import Ws from './socket';
import { USER_STATE_CHANGE, USER_UNREAD_MSG_CNT_CHANGE, USER_UNREAD_NOTIFY_CNT_CHANGE } from './redux/constants';



export const DEV = process.env.NODE_ENV !== 'production';
export const userWsContext = createContext('');


const Notification = (props) => {
  const { type, message, show } = props
  if (!show || !message) return
  const { creator, type: msgType, content } = message

  return (
    <section className={`${type}-message message`}>
      <img src={creator?.avatar} alt="" />
      <div className="right">
        <p className='name'>{creator?.username}</p>
        <p className='msg'>
          {
            msgType === 'image'
              ? '[图片]'
              : content
          }
        </p>
      </div>
    </section>
  )
}


function App(props) {

  const navigate = useNavigate()
  const [userWs, setUserWs] = useState(null)
  const [isShow, setIsShow] = useState(false)
  const [note, setNote] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.currentUser) {
      const ws = new Ws(DEV ? `ws://localhost:8080?userId=${props.currentUser._id}` : 'wss://api.chat.deeruby.com');
      ws.initWs()
      setUserWs(ws)
    }
  }, [props.currentUser])

  useEffect(() => {
    if (localStorage.getItem('profile')) {
      const profile = JSON.parse(localStorage.getItem('profile'))
      dispatch({ type: USER_STATE_CHANGE, data: profile.result })
    }
  }, [])

  useEffect(() => {
    if (props.currentUser) {
      let unReadMsgCnt = 0
      for (let i = 0; i < props.chats.length; i++) {
        const chat = props.chats[i];
        if (chat.unreadUserId === props.currentUser._id) {
          unReadMsgCnt = unReadMsgCnt + chat.unreadMsgCnt
        }
      }
      console.log("========================", unReadMsgCnt)
      dispatch({ type: USER_UNREAD_MSG_CNT_CHANGE, data: unReadMsgCnt })
    }

  }, [props.chats, props.currentUser?._id])

  useEffect(() => {
    if (props.currentUser && props.notifications.length > 0) {
      let unReadNotifyCnt = 0
      for (let i = 0; i < props.notifications.length; i++) {
        const notify = props.notifications[i];
        if (notify.uid === props.currentUser._id) {
          unReadNotifyCnt = unReadNotifyCnt + (notify.isRead ? 0 : 1)
        }
      }
      dispatch({ type: USER_UNREAD_NOTIFY_CNT_CHANGE, data: unReadNotifyCnt })
    }

  }, [props.notifications, props.currentUser?._id])

  useEffect(() => {
    if (props.liveMessage) {
      setIsShow(true)
      setNote(props.liveMessage)

      let timer = null;
      timer ? clearTimeout(timer) : timer = setTimeout(() => setIsShow(false), 5000);

    }
  }, [props.liveMessage])

  return (
    // <BrowserRouter>
    <userWsContext.Provider value={userWs}>

      <div className="App">
        <Routes>
          <Route path='/home/*' element={<Home />} ></Route>
          <Route path='/message/*' element={<Message />} ></Route>
          <Route path='/camera/*' element={<Camera />} ></Route>
          <Route path='/save/*' element={<Save />} ></Route>
          <Route path='/shot/*' element={<Shot />} ></Route>

          <Route path='/' element={<Navigate to={'/home'} />}></Route>

          <Route path='/register' element={<Register />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/share' element={<Share />}></Route>
          <Route path='/conversation/:otherUserId' element={<Conversation />}></Route>
        </Routes>

        <Notification
          show={isShow}
          type="info"
          message={note}
        />
      </div>
    </userWsContext.Provider>

    // </BrowserRouter>

  );
}





const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  users: store.usersState.users,
  liveMessage: store.userState.liveMessage,
  chats: store.userState.chats,
  notifications: store.userState.notifications,
})
export default connect(mapStateToProps, null)(App);
