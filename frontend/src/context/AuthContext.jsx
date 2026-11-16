import {createContext,useContext,useState} from 'react'; import api from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('homesense_user'))}catch{return null}});
async function login(email,password){const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('homesense_token',data.access_token);localStorage.setItem('homesense_user',JSON.stringify(data.user));setUser(data.user);}
async function register(name,email,password){const {data}=await api.post('/auth/register',{name,email,password});localStorage.setItem('homesense_token',data.access_token);localStorage.setItem('homesense_user',JSON.stringify(data.user));setUser(data.user);}
function logout(){localStorage.removeItem('homesense_token');localStorage.removeItem('homesense_user');setUser(null);}
return <C.Provider value={{user,login,register,logout}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
