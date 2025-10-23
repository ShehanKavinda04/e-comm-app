import { capitalCher, numberCher, simpleCher, symbolCher } from "./valiDateChar"

let EnteredPassword = ''

const passwordValidate = (data, setErrorMsg, setError,setCanSubmit) => {

    EnteredPassword = data

    const passCharValidateFunction = (password=[],checkCharSet=[])=>{
        let State= false
        password.forEach((passChar)=>checkCharSet.forEach(checkChar=>{
            if(passChar===checkChar){
                if(!State){
                    State=true
                }
            }
        }))
        return State
    }
    const password = String(data).split('')

     if (password.length > 8) {
        //password validation setup 
        const tempErrorMsg = []
        const simpleCherState = passCharValidateFunction(password,simpleCher)
        const capitalCherState = passCharValidateFunction(password,capitalCher)
        const numberCherState = passCharValidateFunction(password,numberCher)
        const symbolCherState = passCharValidateFunction(password,symbolCher)
        
        if(!simpleCherState){
            tempErrorMsg.push(['Password must be at least 1 simpleCharacters'])
        }
        if(!capitalCherState){
            tempErrorMsg.push(['Password must be at least 1 capitalCharacters'])
         }
        if(!numberCherState){
            tempErrorMsg.push(['Password must be at least 1 number'])
        }
        if(!symbolCherState){
            tempErrorMsg.push(['Password must be at least 1 symbol'])
        }
        if(tempErrorMsg.length> 0){
            setError(true)
            setCanSubmit(false)
            setErrorMsg(tempErrorMsg)
            
        }
        
    } else {
        setError(true)
        setCanSubmit(false)
        setErrorMsg(['Password must be at least 8 characters long.'])

    }
    


}

export const conFirmPasswordValidate = (data, setErrorMsg, setError,setCanSubmit) => {

   if(EnteredPassword!==data){
    setError(true)
    setCanSubmit(false)
    setErrorMsg(['Password does not match.'])
   }

}

export default passwordValidate