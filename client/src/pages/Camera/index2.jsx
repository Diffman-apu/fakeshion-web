// import React, { useRef } from 'react';
// import './index.scss'

// export default function Camera() {

//   const cameraVideoRef = useRef(null);
//   const cameraCanvasRef = useRef(null);

//   function successFunc(mediaStream) {
//     const video = cameraVideoRef.current;
//     // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
//     // 旧的浏览器可能没有srcObject
//     if ('srcObject' in video) {
//       video.srcObject = mediaStream;
//     }
//     video.onloadedmetadata = () => {
//       video.play();
//     };
//   }

//   function errorFunc(err) {
//     console.log(`${err.name}: ${err.message}`);
//     // always check for errors at the end.
//   }
//   // 启动摄像头
//   const openMedia = () => { // 打开摄像头
//     const opt = {
//       audio: false,
//       video: {
//         width: 300,
//         height: 300
//       }
//     };
//     navigator.mediaDevices.getUserMedia(opt).then(successFunc).catch(errorFunc);
//   };
//   // 关闭摄像头
//   const closeMedia = () => {
//     // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
//     const video = cameraVideoRef.current;
//     const stream = video.srcObject;
//     if ('getTracks' in stream) {
//       const tracks = stream.getTracks();
//       tracks.forEach(track => {
//         track.stop();
//       });
//     }
//   };

//   const getImg = () => { // 获取图片资源
//     // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
//     // const canvas = document.getElementById('cameraCanvas') as HTMLCanvasElement;
//     const video = cameraVideoRef.current;
//     const canvas = cameraCanvasRef.current;
//     if (canvas == null) {
//       return;
//     }
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // 把视频中的一帧在canvas画布里面绘制出来
//     const imgStr = canvas.toDataURL(); // 将图片资源转成字符串
//     const base64Img = imgStr.split(';base64,').pop(); // 将图片资源转成base64格式
//     const imgData = {
//       base64Img
//     };
//     closeMedia(); // 获取到图片之后可以自动关闭摄像头
//     return imgData;
//   };


//   const saveImg = () => { // electron项目保存到本地
//     const data = getImg();
//     console.log("base64Img", data)
//     document.getElementById('imgTag').src = data.base64Img
//     // 网页保存图片的方法
//     // const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
//     // saveLink.href = data.base64Img;
//     // saveLink.download = './i.png';
//     // const event = document.createEvent('MouseEvents');
//     // event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
//     // saveLink.dispatchEvent(event);
//   };

//   return (
//     <div className='camera'>
//       <video
//         id="cameraVideo"
//         ref={cameraVideoRef}
//         style={{
//           width: '300px', height: '300px', border: '1px solid gray'
//         }}
//       />
//       <canvas
//         id="cameraCanvas"
//         ref={cameraCanvasRef}
//         width={1280}
//         height={720}
//         style={{
//           width: '300px', height: '300px', border: '1px solid gray'
//         }}
//       />
//       <img id="imgTag" src="" alt="imgTag" />
//       <button onClick={openMedia} >打开摄像头</button>
//       <button onClick={saveImg} >保存</button>
//       <button onClick={closeMedia} >关闭摄像头</button>
//     </div>
//   )
// }

import {
  Button,
  Dialog,
  ImageUploader,
  Modal,
  Popup,
  Toast,
} from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
// import { history } from 'umi';
// import {
//   uploadFile,
//   getProjectInfo,
//   saveUploadFile,
//   deleteFile,
//   getQuestionsByResultId,
// } from '@/app/request/requestApi'; // 接口
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { CameraOutline, ExclamationCircleFill } from 'antd-mobile-icons';
import './index.less';
 
export default function Camera(props){
  const [fileList, setFileList] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});
  const [visible, setVisible] = useState(false);
  const [rotvisible, setRotVisible] = useState(false);
  const [direction, setDirection] = useState(0);
  const [language, setLanguage] = useState('ZH');
 
  useEffect(() => {
    setLanguage(localStorage.getItem('language') ?? 'ZH');
  }, []);
 
  useEffect(() => {
    setTimeout(() => {
      document.getElementsByTagName('title')[0].text = '上传图片';
    }, 500);

    // getProjectInfo().then((res) => {
    //   if (res.success) {
    //     localStorage.setItem('projectInfo', JSON.stringify(res.data));
    //     setProjectInfo(res.data);
    //   } else {
    //     Dialog.alert({
    //       content: res.msg,
    //       onConfirm: () => {
    //         // history.push('../');
    //       },
    //     });
    //   }
    // });
  }, []);
  useEffect(() => {
    if (!visible) {
       // 关闭
      if (document.getElementById('video')?.srcObject) {
        document.getElementById('video').srcObject.getTracks()[0].stop();
      }
      return;
    }
    if (
      //@ts-ignore
       // 开启
      navigator.mediaDevices.getUserMedia ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia
    ) {
      var facingMode = null;
      if (direction == 1) {
        facingMode = { exact: 'environment' };
      } else {
        facingMode = { exact: 'user' };
      }
      // 切换摄像头需先关闭再打开
      if (document.getElementById('video')?.srcObject) {
        document.getElementById('video').srcObject.getTracks()[0].stop();
      }
      //调用用户媒体设备, 访问摄像头
      getUserMedia(
        { video: { width: 480, height: 320, facingMode: facingMode } }, // user 前置
        success,
        error,
      );
    } else {
      alert('不支持访问用户媒体');
    }
  }, [visible, direction]);
  let model = localStorage.getItem('model');


  const onUpload = async (file) => {
    let formData = new FormData();
    formData.append('projectId', projectInfo.projectId);
    formData.append('projectTimeId', projectInfo.timeId);
    formData.append('phone', model);
    formData.append('fileInfos', file);
    // var res = await uploadFile(formData);

    // if (res.success) {
    //   return {
    //     url: res.data[0].imageUrl,
    //   };
    // } else {
    //   Dialog.alert({
    //     content: res.msg,
    //     onConfirm: () => {
    //       //history.push("../");
    //     },
    //   });
    //   return {
    //     url: URL.createObjectURL(file),
    //   };
    // }
  };
 
  const getUserMedia = (constraints, success, error) => {
    if (navigator.mediaDevices.getUserMedia) {
      //最新的标准API
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(success)
        .catch(error);
    } else if (navigator.webkitGetUserMedia) {
      //webkit核心浏览器
      navigator.webkitGetUserMedia(constraints, success, error);
    } else if (navigator.mozGetUserMedia) {
      //firfox浏览器
      navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
      //旧版API
      navigator.getUserMedia(constraints, success, error);
    }
  };
 
  const success = (stream) => {
    //兼容webkit核心浏览器
    let CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
    let videoElement = document.getElementById('video');
    //@ts-ignore
    videoElement.srcObject = stream;
    //@ts-ignore
    videoElement.play();
  };
 
  const error = (error) => {
    alert(`访问用户媒体设备失败${error.name}, ${error.message}`);
    console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
  };
 
  return (
    <>
      <span className="projectTitle">{projectInfo.projectName}</span>
      <ImageUploader
        style={{ '--cell-size': '98px' }}
        value={fileList}
        onDelete={(item) => {
          console.log(item);
          return Dialog.confirm({
            content: '是否确认删除',
          }).then((res) => {
            if (!res) {
              return false;
            } else {
              return true;  ////////////////////////////////////////////
              // return deleteFile({
              //   id: item.id,
              // }).then((res) => {
              //   if (res.success) {
              //     return true;
              //   } else {
              //     Dialog.alert({
              //       content: res.msg,
              //       onConfirm: () => {
              //         //history.push('../');
              //       },
              //     });
              //     return false;
              //   }
              // });
            }
          });
        }}
        onChange={(files) => {
          setFileList(files);
        }}
        disableUpload={true}
        upload={onUpload}
        children={
          <div
            style={{
              width: 98,
              height: 98,
              //borderRadius: 40,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#999999',
            }}
          >
            <CameraOutline
              onClick={() => {
                Dialog.alert({
                  content:
                    language == 'ZH'
                      ? '请摘掉眼镜，露出额头和耳朵，在光线明亮的地方，原地旋转每30度左右拍一张，共6张'
                      : 'Please take off your glasses, expose your forehead and ears, and take a picture every 60 degrees or so in a bright place. A total of 6 pictures',
 
                  onConfirm: () => {
                    setVisible(true);
                  },
                });
              }}
              style={{ fontSize: 32 }}
            />
          </div>
        }
      />
      <div style={{ marginLeft: '20px' }}>
        <ExclamationCircleFill style={{ color: 'rgb(255,51,102)' }} />
        <span>
          {language == 'ZH'
            ? '上传图片需最少六张图片才可进入下一步'
            : 'A minimum of six images are required to upload images to proceed to the next step'}
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Button
          className="btnNext"
          onClick={() => {
            if (fileList.length < 6) {
              Toast.show({
                icon: 'fail',
                content:
                  language == 'ZH'
                    ? '请至少上传6张照片！'
                    : 'Please upload at least 6 photos!',
              });
              return;
            }
 
            // saveUploadFile({
            //   projectId: projectInfo.projectId,
            //   projectTimeId: projectInfo.timeId,
            //   phone: model,
            //   PhoneUniqueId: localStorage.getItem('PhoneUniqueId'),
            // }).then((res) => {
            //   if (res.success) {
            //     if (!projectInfo.timeId) {
            //       Modal.show({
            //         closeOnMaskClick: false,
            //         bodyStyle: {
            //           width: '270px',
            //           height: '220px',
            //           textAlign: 'center',
            //           paddingTop: '47px',
            //         },
            //         showCloseButton: false,
            //         header: null,
            //         actions: [],
            //         content: (
            //           <>
            //             <img className="imgSuccess" />
            //             <div
            //               style={{
            //                 marginTop: '14px',
            //                 fontSize: '14px',
            //                 fontWeight: 'bold',
            //                 color: '#333333',
            //               }}
            //             >
            //               {' '}
            //               {language == 'ZH'
            //                 ? '感谢您的参与！'
            //                 : 'Thank you for your participation.'}
            //             </div>
            //           </>
            //         ),
            //       });
            //       return;
            //     }
            //     localStorage.setItem('resultId', res.data);
            //     localStorage.setItem('files', JSON.stringify(fileList));
            //     getQuestionsByResultId({
            //       resultId: res.data,
            //     }).then((res) => {
            //       if (res.success) {
            //         localStorage.setItem(
            //           'question',
            //           JSON.stringify(res.data.projectTimeInfo[0]),
            //         );
            //         // history.push('form');
            //       } else {
            //         Dialog.alert({
            //           content: res.msg,
            //           onConfirm: () => {},
            //         });
            //       }
            //     });
            //   } else {
            //     Dialog.alert({
            //       content: res.msg,
            //       onConfirm: () => {},
            //     });
            //   }
            // });
          }}
        >
          {language == 'ZH' ? ' 下一步 >' : 'Next >'}
        </Button>
      </div>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        forceRender={true}
        position="top"
        bodyStyle={{
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: 'black',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '60px',
            textAlign: 'center',
            lineHeight: '75px',
            paddingLeft: '80%',
          }}
        >
          // 切换摄像头
          <CameraOutline
            onClick={() => {
              setDirection(direction == 1 ? 0 : 1);
              console.log('切换摄像头');
            }}
            style={{ fontSize: '30px', lineHeight: '60px', color: 'white' }}
          />
        </div>
        //  video 视频
        <video
          id="video"
          width="100%"
          webkit-playsinline="true"
          playsInline={true}
        ></video>
        <Button
          onClick={() => {
            setVisible(false);
          }}
          style={{
            position: 'absolute',
            left: '20px',
            bottom: '30px',
            backgroundColor: 'transparent',
            border: 'none',
            zIndex: '999',
            color: 'white',
          }}
        >
          取消
        </Button>
         {/* // 拍照截取当前帧绘制到画布上 */}
        <div className="divBtn">
            {/* // 主要是获取摄像头的视频流并显示在Video 签中 */}
          <CameraOutline
            onClick={() => {
              var canvas = document.getElementById('canvas');
              canvas.width = document.getElementById('video')?.offsetWidth;
              canvas.height = document.getElementById('video')?.offsetHeight;
              //@ts-ignore
              canvas
                ?.getContext('2d')
                ?.drawImage(
                  document.getElementById('video'),
                  0,
                  0,
                  document.getElementById('video')?.offsetWidth,
                  document.getElementById('video')?.offsetHeight,
                );
              canvas.getContext('2d')?.canvas.toBlob(
                (blob) => {
                  let files = new window.File(
                    [blob],
                    new Date().getTime() + '.jpg',
                  );
                  let formData = new FormData();
                  formData.append('projectId', projectInfo.projectId);
                  formData.append('projectTimeId', projectInfo.timeId);
                  formData.append(
                    'phone',
                    model,
                    // navigator.userAgent.split('AppleWebKit')[0],
                  );
                  formData.append('fileInfos', files);
                  setVisible(false);
                  // uploadFile(formData).then((res) => {
                  //   if (res.success) {
                  //     setFileList([
                  //       ...fileList,
                  //       {
                  //         key: new Date().getTime(),
                  //         url: URL.createObjectURL(files),
                  //         id: res.data[0].id,
                  //       },
                  //     ]);
                  //   } else {
                  //     Dialog.alert({
                  //       content: res.msg,
                  //       onConfirm: () => {},
                  //     });
                  //   }
                  // });
                },
                'image/jpeg',
                0.7,
              );
 
              //@ts-ignore
              var cutAvater = canvas.getContext('2d')?.canvas.toDataURL(0.7);
              var arr = cutAvater?.split(',');
              //@ts-ignore
              var data = window.atob(arr[1]);
              //@ts-ignore
              var mime = arr[0].match(/:(.*?);/)[1];
              var ia = new Uint8Array(data.length);
              for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
              }
              var blob = new Blob([ia], { type: 'image/jpeg' });
            }}
            className="camerBtn"
          />
        </div>
      </Popup>
      <canvas
        style={{ position: 'absolute', left: '0' }} // left: '-1500px'
        id="canvas"
        // width="480"
        // height="320"
      ></canvas>
    </>
  );
};
