import { capitalCher, numberCher, simpleCher, symbolCher } from "./valiDateChar";

const userDataValidate = (data, setErrorMsg, setError, setCanSubmit,errorMsgBase,) => {

 const userData = String(data).split("");

 const tempErrorMsg = []
     let finalUserDataValidResult= true

     const userUserDataValidChar = []
     let validChar = simpleCher.concat([...capitalCher, " "])

    //  if(type==='address'){
    //   validChar = validChar.concat([...numberCher,'/',',','.','-','(',')'])
    // }else if(type==='phone'){
    //   validChar = numberCher.concat(['+','-','(',')',' '])
    // }else
    if(errorMsgBase==='username'){
      validChar = validChar.concat([...capitalCher,'_','.','-',...simpleCher, ' '])
    }else if(errorMsgBase==='email'){

      const dataForCheck = String(data).split('@')
  
        if(dataForCheck.length===2){
            validChar = validChar.concat([...capitalCher,'.',...simpleCher, ...symbolCher, ...numberCher])
            console.log("validChar: ", validChar)
          }
        }        
     
     //USERNAME VALIDATION PROCESS
    userData.forEach((char)=>{
       let valid=false
       validChar.forEach((vChar)=>{
         if(char===vChar){
           valid=true
         }
       })
       userUserDataValidChar.push(valid)
     })
 
     //SET FINAL RESULT FOR USERNAME VALIDATION
     userUserDataValidChar.forEach((ele)=>{
       if(!ele){
         if(finalUserDataValidResult){
           finalUserDataValidResult = false
         }
       }
     })
     if (!finalUserDataValidResult){
       tempErrorMsg.push( 'userData is not valid')
     }
     if(tempErrorMsg.length> 0){
            setError(true)
            setCanSubmit(false)
            setErrorMsg(tempErrorMsg)
            
        }
}
export default userDataValidate;