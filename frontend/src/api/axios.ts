import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:4000",
    withCredentials:true
})

api.interceptors.request.use(
    (config)=>{
        const token = useAuthStore.getState().accessToken;
        if(token){
            config.headers.Authorization= `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)
api.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest = error.config;
        if(
            error.response?.status === 401 &&
            !originalRequest._retry
        ){
             originalRequest._retry = true;
             try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/auth/refresh`,
                    {},
                    {withCredentials:true}
                )

                const newAccessToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newAccessToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest)
             } catch (refreshError) {
                    useAuthStore.getState().logout();
                    return Promise.reject(refreshError);
             }
        }
        return Promise.reject(error)
    }
)

export default api