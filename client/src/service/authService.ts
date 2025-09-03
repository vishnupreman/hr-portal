import api from "./api";

export const authService = {
    register:(data:{email:string, password:string,role:string})=>
        api.post('auth/register',data),
    verifyOtp:(data:{email:string,otp:string})=>
        api.post('auth/verify-otp',data),
    login:(data:{email:string,password:string})=>
        api.post('auth/login',data),
    forgetPassword:(data:{email:string})=>
        api.post('auth/forgot-password',data),
    resetPassword:(data:{email:string,otp:string,newPassword:string})=>
        api.post('auth/reset-password',data)
}