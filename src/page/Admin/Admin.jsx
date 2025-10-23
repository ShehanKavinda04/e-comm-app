import logout from "../../Utils/auth/logout"


const Admin = () => {
  
  return (
    <div className='pt-[130px] w-full ms:h-full  md:h-screen md:overflow-scroll sm:overflow-hidden bg-gray-300'>
      <p>Admin</p>
      <br/>
      <button onClick={logout }>log out</button>
    </div>
  )
}

export default Admin