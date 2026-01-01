


const dbData = {
  category: [
    { title: "Mobile Display", CategoryId: "mobile-display", img: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=200" },
    { title: "Laptops", CategoryId: "laptops", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200" },
    { title: "Headphones", CategoryId: "headphones", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
    { title: "Cameras", CategoryId: "cameras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200" },
    { title: "Gaming", CategoryId: "gaming", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200" },
    { title: "Accessories", CategoryId: "accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" }
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