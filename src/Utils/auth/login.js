import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";


const userLogin =(email ,password, navigate ,setFirebaseError)=>{
 signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
  //   // Signed in 
   const user = userCredential.user;
   console.log(user)   
  // ...
  navigate('/profile')
   })
  .catch((error) => {
    // const errorCode = error.code;
    const errorMessage = error.message;

    console.log(errorMessage)
    if(errorMessage==='Firebase: Error (auth/invalid-credential).'){
      setFirebaseError(prev=>{
        const temp = {...prev, email:'⚠️ Invalid email address or password'}
        return temp
      })
    }

  });
} 
export default userLogin;