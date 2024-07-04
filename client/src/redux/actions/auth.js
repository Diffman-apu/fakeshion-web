import { Toast } from "antd-mobile";
import * as api from "../../api";
import { USER_STATE_CHANGE } from "../constants";

export const signIn = (formData, navigate) => async (dispatch) => {
    try { 
        console.log("登录操作~~")       
        const { data } = await api.signIn(formData);
        localStorage.setItem('profile', JSON.stringify(data));
        dispatch({ type: USER_STATE_CHANGE, data: data.result });
        navigate("/home");
    } catch (error) {
        if(error.response){
            Toast.show({content: error.response.data.message})
        }
        console.log("登录过程出现错误了，原因是：", error);
    }
};

export const signUp = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        localStorage.setItem('profile', JSON.stringify(data));
        dispatch({ type: USER_STATE_CHANGE, data: data.result });
        navigate("/home");
    } catch (error) {
        if(error.response){
            Toast.show({content: error.response.data.message})
        }
        console.log("注册过程出现错误了，原因是：", error);
    }
};