


const dbData = {};

const getDataFromSubCollection = (collectionName,documentID, subCollectionName , setFunction) => {

  if(dbData[collectionName] && dbData[collectionName][documentID] && dbData[collectionName][documentID][subCollectionName] && dbData[collectionName][documentID][subCollectionName].length>0){
    setFunction(dbData[collectionName][documentID][subCollectionName])
  }else{
    console.log()
  }
};
export default getDataFromSubCollection;
