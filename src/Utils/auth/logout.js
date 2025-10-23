import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";

const logout = ()=>{
  signOut(auth).then(() => {
            // Sign-out successful. 
          }).catch((error) => {
            // An error happened.
            console.log(error)
          });

}
export default logout