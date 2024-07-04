import React, { useEffect, useState } from 'react'
import './index.scss'
import { connect, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseOutline } from 'antd-mobile-icons'
import { deleteSearchKey, getDetailsBySearch, getUser, updateSearchKeys } from '../../../../redux/actions/user'

function Actions(props) {

    const [searchItems, setSearchItems] = useState([])
    const [searchSimples, setSearchSimples] = useState([])
    const { liveSearchInput } = props

    const dispatch = useDispatch()
    const navigate = useNavigate()


    // 整理最近搜索项
    useEffect(() => {
        if (props.recentSearches && props.users) {
            const newSearches = props.recentSearches.map((item) => {
                if (!item) return
                const { type, content, uid } = item
                if (type === 'avatar') {
                    const newUser = props.users.find((user) => user._id === content)
                    if (newUser) {
                        return { ...item, user: newUser }
                    }
                    else {
                        dispatch(getUser(content))
                    }
                }
                else {
                    return item
                }
            })
            setSearchItems(newSearches)
        }

    }, [props.recentSearches, props.users])


    // 整理搜索初步结果即 关键词提示项
    useEffect(() => {
        if (props.curSimplesBySearch) {
            const newResults = props.curSimplesBySearch.map((item) => {
                return { type: 'avatar', ...item }
            })
            setSearchSimples([
                { type: 'text', content: liveSearchInput },
                ...newResults,
                { type: 'flag', content: '查看全部结果' }
            ])
        }

    }, [props.curSimplesBySearch])


    // 当点击【最近搜索项】或 【关键词提示项】时
    function onClickSearchItem(item) {
        const { type } = item
        let updateItem
        if (type === 'avatar') {
            const uid = liveSearchInput === '' ? item.user._id : item._id
            updateItem = { type: 'avatar', content: uid }
            navigate(`/home/otherProfile/${uid}`)
            // dispatch({type: USER_SEARCH_INPUT_CHANGE, data: ''})
        }
        else {
            updateItem = { type: 'text', content: item.content }
            dispatch(getDetailsBySearch(item.content))
            navigate(`/home/homeSearch/results/${item.content}`)
        }
        dispatch(updateSearchKeys(updateItem))

    }


    function onDeleteSearch(id){
        dispatch(deleteSearchKey(id))
    }


    // 渲染单个搜索项
    function renderSearchItem(item) {
        if (!item) return
        const { type } = item

        if (type === 'text') {
            return (
                <div className="search-item" onClick={() => onClickSearchItem(item)}>
                    <i className='iconfont icon-search left'></i>
                    <span className='middle'>{item.content}</span>
                    <CloseOutline className='right' />
                </div>
            )
        }
        else if (type === 'avatar') {
            const obj = liveSearchInput === '' ? item.user : item
            return (
                <div className="search-item" onClick={() => onClickSearchItem(item)}>
                    <img src={obj?.avatar} alt="" className='left' />
                    <div className="info middle">
                        <p className='name'>{obj?.username}</p>
                        <p className='description'>{obj?.description}</p>
                        <p className='count'>{obj?.followerCount}位粉丝</p>
                    </div>
                    {
                        !liveSearchInput && <CloseOutline className='right' onClick={()=>onDeleteSearch(item._id)}/>
                    }
                </div>
            )
        }
        else if (type === 'flag') {
            return (
                <div className="searchFooter" onClick={() => onClickSearchItem(item)}>
                    {item.content}
                </div>
            )
        }
    }

    return (
        <div className='actions'>
            {
                liveSearchInput==='' &&
                <div className="title">
                    <span className='name'>最近搜索</span>
                    <span className='clear' onClick={()=>onDeleteSearch('all')}>全部清除</span>
                </div>}

            <div className="body">
                {
                    liveSearchInput===''
                        ?
                        searchItems.map((item) =>
                            renderSearchItem(item)
                        )
                        :
                        searchSimples.map((item) =>
                            renderSearchItem(item)
                        )
                }
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
export default connect(mapStateToProps, null)(Actions)

