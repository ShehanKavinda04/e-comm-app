
import { emailDomain, numberCher, simpleCher } from "./valiDateChar"

const emailValidate =(data , setErrorMsg, setError,setCanSubmit)=>{
  

  //EMAIL SETUP FOR VALIDATION 
  const dataForCheck = String(data).split('@')

  
  if(dataForCheck.length===2){
  //ERROR MESSAGE SETUP
    const tempErrorMsg = []
    let finalUsernameValidResult= true
  //USER NAME VALIDATE SETUP
    const usernameValidChar = []
    const validChar = simpleCher.concat(numberCher)
    const username = dataForCheck[0].split('')
    
    
    //USERNAME VALIDATION PROCESS
    username.forEach((char)=>{
      let valid=false
      validChar.forEach((vChar)=>{
        if(char===vChar){
          valid=true
        }
      })
      usernameValidChar.push(valid)
    })

    //SET FINAL RESULT FOR USERNAME VALIDATION
    usernameValidChar.forEach((ele)=>{
      if(!ele){ 
        if(finalUsernameValidResult){          
          finalUsernameValidResult = false
        }
      }
    })
    if (!finalUsernameValidResult){
      tempErrorMsg.push('username is not valid')
    }

    //EMAIL VALIDATION SETUP
    let emailDomainValidate = false

    //EMAIL VALIDATION PROCESS
    emailDomain.forEach((domain)=>{
      if(domain === dataForCheck[1]){
         if(!emailDomainValidate){ 
          emailDomainValidate = true
        }
      }       
    })

    //SET FINAL RESULT FOR EMAIL VALIDATION 
    if(!emailDomainValidate){
      tempErrorMsg.push('domain is not valid')
    }
    //SET FINAL ERROR RESULT TO THE STATE-SETTER-FUNCTION
    if(tempErrorMsg.length>0){
      setError(true)
      setCanSubmit(false)
    }
    setErrorMsg(tempErrorMsg)
  }else{
    setError(true)
    setCanSubmit(false)
    setErrorMsg(['not a validate email'])
  }

}
export default emailValidate