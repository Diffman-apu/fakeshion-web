import React, { useEffect, useRef, useState } from 'react'
import { Grid, SearchBar } from 'antd-mobile'
import './index.scss'
import { connect, useDispatch } from 'react-redux'
import { getAvatarsBySearch, getDetailsBySearch, getSearchKeys, getSearchSimples, getUser } from '../../../redux/actions/user'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Recommends from './Recommends'
import Actions from './Actions'
import Results from './Results'
import { USER_SEARCH_INPUT_CHANGE } from '../../../redux/constants'


function HomeSearch(props) {
  const [isFocus, setIsFocus] = useState(false)
  const [inputText, setInputText] = useState('')


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const searchBarRef = useRef()


  // useEffect(()=>{
  //   setInputText(props.liveSearchInput)
  // },[props.liveSearchInput])


  // 当搜索框获取焦点时
  function onFocusSearchBar() {
    setIsFocus(true)
    dispatch(getSearchKeys())
    navigate('/home/homeSearch/actions')
    dispatch({type: USER_SEARCH_INPUT_CHANGE, data: ''})
  }

  // 当搜索框进行输入时
  function onChangeSearchBar(value) {
    if (value !== '') {
      dispatch(getAvatarsBySearch(value))
    }
    dispatch({type: USER_SEARCH_INPUT_CHANGE, data: value})
  }


  function onBackArrow(){
    setIsFocus(false)
    dispatch({type: USER_SEARCH_INPUT_CHANGE, data: null})
    searchBarRef.current.clear()
    navigate('/home/homeSearch')
  }


  return (
    <div className='search'>
      <div className="header">
        <div className="search-bar">
          {
            (isFocus || props.liveSearchInput || props.liveSearchInput === '') && 
            <i className='iconfont icon-arrow-left' onClick={onBackArrow} />
          }
          <SearchBar
            ref={searchBarRef}
            placeholder='搜索'
            onFocus={onFocusSearchBar}
            onChange={onChangeSearchBar}
            value={props.liveSearchInput}
          // onBlur={() => setIsFocus(false)}
          />
        </div>

      </div>


      <div className="body">
        <Routes>
          <Route path='/' element={<Recommends />} />
          <Route path='/actions' element={<Actions />} />
          <Route path='/results/:inputText' element={<Results />} />
        </Routes>
      </div>
    </div>
  )
}


const mapStateToProps = (store) => ({
  feeds: store.usersState.feeds,
  recentSearches: store.userState.recentSearches,
  users: store.usersState.users,
  curSimplesBySearch: store.userState.curSimplesBySearch,
  curDetailsBySearch: store.userState.curDetailsBySearch,
  liveSearchInput: store.userState.liveSearchInput,

})
export default connect(mapStateToProps, null)(HomeSearch)
