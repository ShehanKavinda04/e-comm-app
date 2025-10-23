import {  createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import setDataDocument from '../dataFetch/setDataDocument'


const userRegister = (name,email,password,navigate)=>{
  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
    const userDataSet= {
      name,
      email,
      password,      
      uid:user.uid,
      role:'user',
    }
    setDataDocument('users',user.uid,userDataSet)
    console.log('User 1111 registered successfully:', userDataSet)
    
      navigate('login')
  }
)
  .catch((error) => {
    // const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    // ..
  });
}

export default userRegister   