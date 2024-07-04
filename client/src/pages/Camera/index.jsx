import React, { useState, useRef } from 'react';
import './index.scss'

import { PictureOutline, CameraOutline, DownOutline, CloseOutline, RightOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom';
import { Grid, NavBar } from 'antd-mobile';



function Camera() {
  const imgUrls = new Array(16).fill(0).map((_, index) => `/images/test/${index + 1}.png`)
  const [selectedImg, setSelectedImg] = useState('/images/test/11.png')
  const navigate = useNavigate()


  // 点击【拍摄】按钮时
  function onTakePicture(){
    navigate('/shot')
  }

  // 选中某个图片时
  function onClickImage(url, index){
    setSelectedImg(url)
    const rowIdx = Math.floor(index / 4)
    const imgElem = document.querySelector('.selectImg')
    const imgCollction = document.querySelector('.footer')
    imgElem.src = url
    imgCollction.scrollTop = rowIdx * 90
  }


  return (
    <div className='camera'>
      <NavBar 
        onBack={()=> navigate(-1) } 
        backArrow={<CloseOutline />} 
        right={<RightOutline onClick={()=>navigate('/save', {state:{url: selectedImg}})}/>}
      >
        新帖子
      </NavBar>
      
      <div className="imgContainer">
        <img src={imgUrls[0]} alt="" className='selectImg' />
      </div>
      
      

      <div className="middle">
        <div className="left">
          <span>图库</span>
          <DownOutline className='mid-icon' />
        </div>
        <div className="right">
          <PictureOutline className='mid-icon' />
          <CameraOutline className='mid-icon' onClick={onTakePicture} />
        </div>

      </div>

      <div className="footer">
        <Grid columns={4} gap={3}>
          {
            imgUrls.map((url, index) => (
              <Grid.Item className='grid-item' key={index} onClick={()=>onClickImage(url, index)}>
                <img src={url} alt="" className='grid-img' />
              </Grid.Item>
            ))
          }
        </Grid>
      </div>


      {/* <button className="imageupload__button" onClick={handleUpload}>
          上传
        </button> */}
    </div>
  );
}

export default Camera;
