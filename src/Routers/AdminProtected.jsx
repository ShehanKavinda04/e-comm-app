import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { userSelector } from '../Store/ReduxSlice/userSlice'
import NoUrl from '../page/404/NoUrl'


const AdminProtected = () => {
   // const admin = false  

   const userData= useSelector(userSelector)  
   const [canView,setCanView] = useState(false) 

   useEffect(()=>{
      if(userData.name){
         if(!(userData.name === 'default')){
            if(userData.role === "admin"){
               setCanView(true)
            }
         }
      }
 
   },[userData])
   
   return canView? <Outlet/>:<NoUrl/>     
}

export default AdminProtected 