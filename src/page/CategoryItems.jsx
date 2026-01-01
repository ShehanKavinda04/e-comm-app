import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Loading from "../component/Loading/Loading"
import Footer from "../component/Footer"
import { getProducts } from "../Services/MockDataService"
import { CategoryItem } from "../component/Product/Product"
import getDataFromCollection from "../Utils/dataFetch/getDataFromCollection"

const CategoryItems = () => {
  const { categoryId } = useParams();
  const [categoryItemData, setCategoryItemData] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch products and filter by categoryId
    const allProducts = getProducts();
    const filtered = allProducts.filter(p =>
      p.category && p.category.toLowerCase().replace(/\s+/g, '-') === categoryId.toLowerCase()
    );
    setCategoryItemData(filtered);

    // 2. Fetch category title from the central collection
    getDataFromCollection('category', (categories) => {
      const found = categories.find(c => c.CategoryId === categoryId);
      if (found) setCategoryTitle(found.title);
      setLoading(false);
    });
  }, [categoryId]);

  if (loading) {
    return <Loading />
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className='pt-[130px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 pb-20'>
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 capitalize" >
            {categoryTitle || categoryId.replace(/-/g, ' ')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Found {categoryItemData.length} items in this category</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryItemData.length > 0 ? (
            categoryItemData.map((item, index) => (
              <CategoryItem
                key={index}
                id={item.id}
                imgUrl={item.image}
                name={item.brand}
                product={item.category}
                rating={item.rating || 4.5}
                reviews={`${Math.floor(Math.random() * 100) + 20} reviews`}
                title={item.title}
                price={item.price}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 italic">No products found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CategoryItems

