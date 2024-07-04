import React, { useEffect, useState } from 'react'
import './index.scss'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, NavBar, Toast } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { signUp } from '../../../redux/actions/auth'

export default function Register() {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassWord] = useState('')
    const [confirmPwd, setConfirmPwd] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()


    function handleRegister() {
        const formData = {
            // username: username,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            confirmPwd: confirmPwd,
        }

        dispatch(signUp(formData, navigate))
    }

    return (
        <div className='register'>
            <NavBar back='返回' onBack={() => navigate(-1)}>
                注册
            </NavBar>

            <div className="form">
                {/* <div className="logo"> */}
                    <img src="/images/logo.png" alt="" className='logo'/>
                {/* </div> */}
                <div className='form-item'>
                    <span>手机号：</span>
                    <input type="text" placeholder='请输入手机号~' onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className='form-item'>
                    <span>邮  箱：</span>
                    <input type="email" placeholder='请输入邮箱~' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='form-item'>
                    <span>密  码：</span>
                    <input type="password" placeholder='请输入密码~' onChange={(e) => setPassWord(e.target.value)} />
                </div>
                <div className='form-item'>
                    <span>确认密码：</span>
                    <input type="password" placeholder='请确认您的密码~' onChange={(e) => setConfirmPwd(e.target.value)} />
                </div>
                <div className='form-btn' onClick={handleRegister}>
                    注册
                </div>

                <div className='link'>
                    <Link to={'/login'} className='login-link'>已经拥有账户，去登陆~</Link>
                </div>
            </div>

        </div>
    )
}
