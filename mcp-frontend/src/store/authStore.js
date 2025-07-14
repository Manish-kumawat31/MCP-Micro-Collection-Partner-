import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';


export const useAuthStore = create((set) => ({
    authUser: null,
    
    login : async(data)=>{
        try {
            let res = await axiosInstance.post('/api/auth/login' , data);
            set({authUser:res.data.user})
            toast.success('Login successfully!');
            // console.log({authUser});
        } catch (error) {
            set({ authUser: null })
            console.log("error :" , error.message);
            toast.error(error.response?.data?.message || 'Login failed!');
            
        }
    },
    signup : async(data)=>{
        try {
            let res = await axiosInstance.post('/api/auth/signup' ,data);
            set({authUser:res.data.user})
            toast.success('Account created successfully!');
        } catch (error) {
            set({ authUser: null })
            console.log("error :" , error.message);
            toast.error(error.response?.data?.message || 'Signup failed!');

        }

    },
    
    logout : async()=>{
        try {
            let res = await axiosInstance.post('/api/auth/logout');
            set({authUser : null});
            toast.success('Lougout');

        } catch (error) {
            toast.error("Error")
        }
    },

    checkAuth: async () => {
        try {
            let res = await axiosInstance.get('/api/auth/check');
            set({ authUser: res.data })

        } catch (error) {
            console.log(error);
            
            set({ authUser: null })
        }
    }

}))