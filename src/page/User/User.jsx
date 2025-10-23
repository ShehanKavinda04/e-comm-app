import React, { useState } from 'react'
import logout from '../../Utils/auth/logout'
import IconButton from '@mui/material/IconButton'
import Overview from '../ProfileDetails/Overview'
import Address from '../ProfileDetails/Address'
import MyOrder from '../ProfileDetails/MyOrder'
import PaymentMethod from '../ProfileDetails/PaymentMethod'
import UserProfile from '../ProfileDetails/UserProfile'
import Wishlist from '../ProfileDetails/Wishlist'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';




const labelIcon =[
  {
    
    title:"Overview",
    name:"Overview"
  },{
    Icon:BusinessCenterIcon,
    title:"My Orders",
    name: "My_Orders",    
  },{
    Icon:FavoriteIcon,
    title:"Wishlist",
    name:"Wishlist"
  },{
    Icon:PersonIcon,
    title:"Profile & Settings",
    name:"Profile_Settings"
  },{
    Icon:LocationOnIcon,
    title:"Address",
    name:"Address"
  },{
    Icon:MonetizationOnIcon,
    title:"Payment Methods",
    name:"Payment_Methods"
  },
]

const User = () => {
  const [whoIsClick,setWhoIsClick]= useState({
    Overview:false,
    My_Orders:false,
    Wishlist:false,
    Profile_Settings:true,
    Address:false,
    Payment_Methods:false,
  })

  return (
    <div className='pt-[110px] w-full ms:h-full  md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300 '>
      <div className='flex flex-col md:flex-row md:items-center gap-5 justify-between mb-5'>
        <div>
          <p className='text-5xl text-black font-normal mb-2 sm:ml-5 md:ml-14'>User Account</p>
          <p className='text-gray-700 font-medium sm:ml-5 md:ml-14'>Manage your account orders,wishlist, and account settings</p>
        </div>
        <div className='flex md:flex-row sm:flex-col md:gap-15 sm:gap-4 sm:items-center '>
          <button className="bg-orange-600 text-white  font-medium sm:w-[250px] text-xs sm:text-sm py-2 w-[200px] sm:py-2 px-8 rounded-full shadow hover:bg-orange-700 transition">
            Gold Member
          </button>
          <button className="bg-red-600 text-white font-bold text-xs sm:text-sm py-3 md:mr-25 sm:py-3 px-2 w-[250px] sm:px-8 rounded-md shadow hover:bg-red-700 transition">
            + Become a Seller
          </button>
        </div>
      </div>
      <div className='flex items-center md:px-25 gap-10 px-5 mb-5 justify-between'>
        <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-6 items-center w-full'>

          {labelIcon.map(({Icon,title,name},index)=>{
            return(
              <ProfileTab key={index} clickFun={{whoIsClick,setWhoIsClick}} Icon={Icon} name={name} title={title}/>
            )
          })}       
          
        </div>        
      </div>      
      <div className='w-full bg-black h-[1px] '/>
      <div>
        <button className='bg-red-500 text-white p-2 rounded' onClick={logout}>log out</button>
      </div>
      {/* Conditionally render Overview based on state */}
      {whoIsClick.Overview && <Overview />}
      {whoIsClick.My_Orders && <MyOrder/>}
      {whoIsClick.Wishlist && <Wishlist />}
      {whoIsClick.Profile_Settings && <UserProfile />}
      {whoIsClick.Payment_Methods && <PaymentMethod />}
      {whoIsClick.Address && <Address />}
      
    </div>
  )
}
export default User

const ProfileTab= ({title,name,clickFun,Icon})=>{
   const clickHandle=()=>{
    const obj={
      Overview:false,
      My_Orders:false,
      Wishlist:false,
      Profile_Settings:true,
      Address:false,
      Payment_Methods:false,
    }
    switch (name) {
      case 'Overview':
        obj.Overview = true,
        obj.Profile_Settings=false
        break
      case 'My_Orders':
        obj.My_Orders = true,
        obj.Profile_Settings=false
        break
      case 'Wishlist':
        obj.Wishlist = true,
        obj.Profile_Settings=false
        break
      case 'Profile_Settings':
        obj.Profile_Settings = true
        break
      case 'Address':
        obj.Address = true,
        obj.Profile_Settings=false
        break
      case 'Payment_Methods':
        obj.Payment_Methods = true,
        obj.Profile_Settings=false
        break
      default:
        obj.Profile_Settings = true
        break
    }

    clickFun.setWhoIsClick(obj)
   }

  const active = clickFun.whoIsClick[name];
  
  return(
    
      <IconButton
      onClick={clickHandle}
      sx={{
        fontSize: '17px',
        margin: '1px',
        marginLeft: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={`cursor-pointer flex flex-col items-center sm:flex-row sm:items-center transition-all duration-200 
        ${active ? 'text-red-600 border-b-2 border-red-600' : 'text-black border-b-2 border-transparent'}`}
      >
        {/* icon container */}
        <div
          className={`border p-1 rounded-md transition-colors duration-200 ${
            active ? 'border-red-500' : 'border-gray-500'
          }`}
        >
          {Icon && <Icon className="text-[20px] sm:text-[22px]" />}
        </div>

        {/* title */}
        <p
          className={`font-normal ml-1 sm:ml-2 text-sm sm:text-base md:text-lg transition-colors duration-200 ${
            active ? 'text-red-600' : 'text-black'
          }`}
        >
          {title}
        </p>
      </div>
    </IconButton>    
  )
}
