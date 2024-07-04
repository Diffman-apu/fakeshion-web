import React from 'react'

export default function test() {

    // function upLoadPost(){
    //     const newDb = doc(db, 'posts', 'RvEulJuf1UTyuXHdLrDq6wX5bAG2')
    //     // const collectionRef = collection(newDb, 'userPosts')
    //     addDoc(collection(newDb, 'userPosts'),{
    //         downloadURL: 'https://firebasestorage.googleapis.com/v0/b/ins-mobile-clone.appspot.com/o/images2%2F1714661444238.jpg?alt=media&token=9c8cf6ee-2477-4e6e-b792-a682659f4a93',
    //         caption: 'A good staff of heart to you !',
    //         likesCount: 596,
    //         commentsCount: 788,
    //         type: 0,
    //         createTime: serverTimestamp()
    //     } ).then((result) => {
    //         console.log("post 上传成功！！")
    //     })


    // }
    // function handleUpLoad(){
    //     const elem = document.querySelector('.fileElem')
    //     const file = elem.files[0]

    //     const storage = getStorage();

    //     // Create the file metadata
    //     /** @type {any} */
    //     const metadata = {
    //         contentType: 'image/jpeg'
    //     };

    //     // Upload file and metadata to the object 'images/mountains.jpg'
    //     const storageRef = ref(storage, 'images2/' + Date.now() + '.jpg');
    //     const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    //     // Listen for state changes, errors, and completion of the upload.
    //     uploadTask.on('state_changed',
    //         (snapshot) => {
    //             // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //             // console.log("bytesTransferred",snapshot.bytesTransferred, "totalBytes", snapshot.totalBytes )
    //             let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //             console.log("progress---------------------------", progress)
    //             let progressElem = document.querySelector('.progress-bar')
    //             progressElem.value = '50'

    //             console.log('Upload is ' + progress + '% done');
    //             switch (snapshot.state) {
    //                 case 'paused':
    //                     console.log('Upload is paused');
    //                     break;
    //                 case 'running':
    //                     console.log('Upload is running');
    //                     break;
    //             }
    //         },
    //         (error) => {

    //         },
    //         () => {
    //             // Upload completed successfully, now we can get the download URL
    //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 console.log('File available at', downloadURL);
    //                 const imgElem = document.querySelector('.getImg')
    //                 imgElem.src = downloadURL
    //             });
    //         }
    //     );
    // }
  return (
    <div>
                {/* <div>
                <input type="file" class="fileElem" onChange={handleUpLoad}/>
                <progress class="progress-bar" value="0" max="100">0%</progress>
                <div>
                    <img src="" alt="" class="getImg" />
                </div>
            </div> */}

    </div>
  )
}
