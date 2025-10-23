import {  Modal } from "@mui/material"
import { forwardRef, useImperativeHandle, useState } from "react"
import {doc, setDoc } from 'firebase/firestore'
import db from '../Firebase/Firebase'
import Login from "../page/Login"

const PaymentModal = (props,ref) => {
  const [open,setOpen] =useState(false) 
  //const handleOpen = ()=>setOpen(true)
  const handleClose = ()=>setOpen(false)

  useImperativeHandle(ref,()=>({
    handleOpen:()=>setOpen(true)
  }))
  const addData= ()=>{
    setDoc(doc(db, "category/category1/category5", "category5_item6"), {
      title: "category5 title6",
      img: "https://i.redd.it/d2hd73xxwvaa1.jpg",
      rating:2.3, 
      
    }).then(() => {
      console.log("Document written with ID: ");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}      
    >
      <div>
        <p className="text-gray-50" >my click button:</p>
        <button onClick={addData}>hii click me</button>
        <Login/>
      </div>
      
    </Modal>
  )
}

export default forwardRef(PaymentModal)