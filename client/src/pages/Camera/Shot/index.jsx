import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './index.scss'
import { NavBar } from 'antd-mobile';
import { CloseOutline, CheckOutline, RightOutline } from 'antd-mobile-icons'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';


export default function Shot() {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const thumbnailRef = useRef()
    const showAreaRef = useRef()
    const navigate = useNavigate()
    const [thumbnailImg, setThumbnailImg] = useState('')
    const [facingDirection, setFacingDirection] = useState('font')  // 0：前置摄像头  1：后置摄像头  

    useEffect(() => {
        const facingMode = facingDirection === 'font' ? { exact: 'user' } : { exact: 'environment' }
        startCamera(facingMode)
    }, [facingDirection])


    const startCamera = async (facingMode) => {
        // { exact: 'environment' }   { exact: 'user' }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        videoRef.current.srcObject = stream;
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(function (track) {
            track.stop();
        });

        videoRef.current.srcObject = null;
    };

    const capture = () => {
        const video = videoRef.current
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;

        context.drawImage(videoRef.current, 0, 0, video.offsetWidth, video.offsetHeight);
        const urlImg = canvas.toDataURL()

        showAreaRef.current.style.display = 'block'
        showAreaRef.current.src = urlImg
        thumbnailRef.current.src = urlImg

        setThumbnailImg(urlImg)
        stopCamera()

        // navigate('/save', {
        //     state: {
        //         url: urlImg
        //     }
        // })
    }

    function NavRight() {
        return ( 
            thumbnailImg &&
            <i
                className='iconfont icon-cc-arrow-right'
                onClick={() => navigate('/save')}
            />
        )
}

function onNextStep() {
    navigate('/save', { state: { url: thumbnailImg } })
}

function onRepost() {
    const facingMode = facingDirection === 'font' ? { exact: 'user' } : { exact: 'environment' }
    startCamera(facingMode)
    showAreaRef.current.style.display = 'none'

}

return (
    <div className="shot">
        <NavBar onBack={() => navigate(-1)} backArrow={<CloseOutline />} right={<NavRight />} >
            拍照上传
        </NavBar>

        <video ref={videoRef} autoPlay width="100%" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="showArea" ref={showAreaRef}>
            <img src={thumbnailImg} alt="" />
            <div className="shotBtn">
                <span className='reShot' onClick={onRepost}>重新拍摄</span>
                <span className='next' onClick={onNextStep}>下一步</span>
            </div>
        </div>

        <div className="footer">
            <img ref={thumbnailRef} src='/images/test/11.png' alt="" className='thumbnail' />
            <div className="shotBtn outer" onClick={capture}>
                <div className="inner"></div>
            </div>
            <i className='iconfont icon-hupanxiangjiqiehuan'
                onClick={() => setFacingDirection(facingDirection === 'font' ? 'back' : 'font')}
            />
        </div>

    </div>
)
}
