import React, { useEffect, useState } from 'react'
import './index.scss'
import { Grid } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'

const clickBar = [
    {
        name: '为你精选',
        type: 'post'
    },
    {
        name: '用户',
        type: 'account'
    },

    {
        name: '标签',
        type: 'label'
    },
    {
        name: '活动',
        type: 'activity'
    },
    {
        name: '地点',
        type: 'area'
    },
]

function Results(props) {
    const [filteredData, setFilteredData] = useState([])
    const [resultType, setResultType] = useState('post')

    const navigate = useNavigate()

    useEffect(() => {
        const newResults = props.curDetailsBySearch[resultType]
        setFilteredData(newResults)
    }, [props.curDetailsBySearch])

    function onSwitchBar(type) {
        setResultType(type)
        const newResults = props.curDetailsBySearch[type]
        setFilteredData(newResults)
    }

    return (
        <div className='results'>
            <div className="title">
                {
                    clickBar.map((item) => {
                        const { name, type } = item
                        return (
                            <span
                                className={`clickItem ${resultType === type ? 'selectedItem' : ''}`}
                                onClick={() => onSwitchBar(type)}
                            >
                                {name}
                            </span>
                        )
                    })}
            </div>

            <div className="body">
                {
                    resultType === 'post'
                        ?
                        <Grid columns={3} gap={3}>
                            {
                                filteredData && filteredData.concat(filteredData, filteredData).map((post, index) => (
                                    <Grid.Item className='grid-item' key={index}>
                                        <img src={post.imageURL} alt="" className='grid-img' />
                                    </Grid.Item>
                                ))
                            }
                        </Grid>
                        :
                        filteredData.map((item) => {
            
                            const { type, content } = item
                            if (type === 'accounts') {
                                return (
                                    <div className="result-item" onClick={()=>navigate(`/home/otherProfile/${item._id}`) }>
                                        <img src={item?.avatar} alt="" className='left' />
                                        <div className="info middle">
                                            <p className='name'>{item.username}</p>
                                            <p className='description'>{item.description}</p>
                                            <p className='count'>{item.followerCount}位粉丝</p>
                                        </div>
                                    </div>
                                )
                            }
                        })
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
})

export default connect(mapStateToProps, null)(Results)