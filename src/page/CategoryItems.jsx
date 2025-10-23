import { useSelector } from "react-redux"
import { categorySelector } from "../Store/ReduxSlice/categorySlice"
import { useParams } from "react-router-dom"
import { ListItemButton, Rating } from "@mui/material"
import { useEffect, useState } from "react"
import getDataFromSubCollection from "../Utils/dataFetch/getDataFromSubCollection"
import Loading from "../component/Loading/Loading"
import Footer from "../component/Footer"

const CategoryItems = () => {
  const category = useSelector(categorySelector)
  const {categoryId}= useParams();
  const [categoryTitle]= category.filter((ele)=>ele.id===(categoryId.toString())
)
  const [categoryItemData, setCategoryItemData]=useState([])
  
  //fetch category items data
  useEffect(()=>{
    getDataFromSubCollection('category',categoryId,categoryId,setCategoryItemData)
  },[])
  if(categoryItemData.length === 0){
    return<Loading/>
  }  
    return (
      <div>
        <div className='pt-[130px] w-full h-screen sm:px-6 md:px-20 overflow-scroll bg-gray-300'>
          <h2 className="text-black ml-5 font-bold mb-6 text-xl" >
            { categoryTitle ? categoryTitle.title : "Category Not Found"}
          </h2>
          <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows[auto] gap-5 px-3 ">
            {categoryItemData?.map(({img,title},index)=>
              <CategoryItemsBlock className=' cursor-pointer ' key={index} imgUrl={img} title={title}/>
            )}
          </div>
        </div>
        <Footer/>
      </div>
  )
}

export default CategoryItems

const CategoryItemsBlock = ({imgUrl,title})=>{
  return(
    <ListItemButton sx={{
      padding:0,
      margin:0,
    }}>
    <div className='bg-amber-50 w-full shadow-md cursor-pointer hover:scale-105 transition-all mt-[10px] rounded-md p-3 mx-3'>
      <img src={imgUrl} alt={title} className="w-full h-[180px] object-cover rounded" />
      <h3 className="text-black font-semibold mt-2">{title}</h3>
      <div className="mt-1">
        <Rating 
          name="half-rating-read"
          defaultValue={2.5}
          precision={0.5} size="small" readOnly />
      </div>
    </div>
    </ListItemButton>
  )

}