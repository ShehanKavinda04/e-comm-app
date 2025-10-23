
import { useRef } from 'react'
import Header from '../component/Header'
import { Outlet } from 'react-router-dom'
import DarkModal from '../Modals/DarkModal'  


const MainLayout = () => {
  //const paymentModalRef = useRef()
  const darkModalRef = useRef();
  return (
    <div>
      <Header darkModalRef={darkModalRef} />
      <Outlet />
      <DarkModal ref={darkModalRef} />
      
      
    </div>
    
    
  )
}

export default MainLayout