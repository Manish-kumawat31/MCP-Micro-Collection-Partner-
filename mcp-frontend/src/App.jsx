import React , {useEffect} from 'react'
import { Routes , Route  , useNavigate, Navigate} from 'react-router-dom'
import Navbar from './compoents/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import McpDashboard from './pages/McpDashboard.jsx';
import { useAuthStore } from './store/authStore.js';
import {Toaster} from 'react-hot-toast';
import ManagePickupPartners from './pages/ManagePickupPartners.jsx';
import Orders from './pages/Order.jsx';

const App = () => {
  const {authUser,checkAuth}  = useAuthStore();
  const navigate = useNavigate();  

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);
  

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/dashboard' element={authUser? <McpDashboard/> : <Navigate to="/login"/> } />
        <Route path='/manage-partners' element={authUser? <ManagePickupPartners/> :<Navigate to="/login"/> } />
        <Route path='/manage-orders' element={authUser? <Orders/> : <Navigate to="/login"/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App