const dbData = {
  category: [
    { title: "Mobile Parts", CategoryId: "mobile-parts", img: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=500&q=80" },
    { title: "Laptop Parts", CategoryId: "laptop-parts", img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80" },
    { title: "Accessories", CategoryId: "accessories", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80" }
  ]
}
const getDataFromCollection = (collectionName, setFunction) => {
  if (dbData[collectionName] && dbData[collectionName].length > 0) {
    setFunction(dbData[collectionName])
  } else {
    console.warn(`Collection ${collectionName} not found or empty`);
  }
}

export default getDataFromCollection