import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'
import { useDispatch } from 'react-redux'
import { NavBar, Toast } from 'antd-mobile'
import { signIn } from '../../../redux/actions/auth'


export const DEV = process.env.NODE_ENV !== 'production';
// export const userWsContext = createContext('');
function Login(props) {

    // const [username, setUserName] = useState('')
    const [input, setInput] = useState('')
    const [password, setPassWord] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleLogin() {
        const formData = {
            input: input,
            password: password,
        }

        dispatch(signIn(formData, navigate))
    }


    return (
        <div className='login'>
            <NavBar back='返回' onBack={() => navigate(-1)}>
                登录
            </NavBar>

            <div className="form">
                <img src="/images/logo.png" alt="" className='logo' />

                <div className='form-item'>
                    <span>邮 箱：</span>
                    <input type="text" placeholder='请输入手机号或邮箱~' onChange={(e) => setInput(e.target.value)} />
                </div>
                <div className='form-item'>
                    <span>密 码：</span>
                    <input type="password" placeholder='请输入密码~' onChange={(e) => setPassWord(e.target.value)} />
                </div>
                <div className='form-btn' onClick={handleLogin}>
                    登录
                </div>

                <div className='link'>
                    <Link to={'/register'} className='login-link'>尚未建立账户，去注册~</Link>
                </div>
            </div>

        </div>
    )
}




export default Login