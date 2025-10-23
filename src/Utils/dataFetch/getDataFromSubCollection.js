import { collection, getDocs } from "firebase/firestore";
import db from "../../Firebase/Firebase";

const dbData = {};

const getDataFromSubCollection = (collectionName,documentID, subCollectionName , setFunction) => {

  if(dbData[collectionName] && dbData[collectionName][documentID] && dbData[collectionName][documentID][subCollectionName] && dbData[collectionName][documentID][subCollectionName].length>0){
    setFunction(dbData[collectionName][documentID][subCollectionName])
  }else{
    getDocs(collection(db, `${collectionName}/${documentID}/${subCollectionName}`)).then((querySnapshot) => {
      console.log("data read form db");
      const dataArr = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        dataArr.push({ ...doc.data(), CategoryId: doc.id });
      });
      // dbData[collectionName][documentID][subCollectionName] = dataArr;
      setFunction(dataArr);
      
    }).catch(err=>console.log(err))  
  }
};
export default getDataFromSubCollection;
