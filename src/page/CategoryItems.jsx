import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Loading from "../component/Loading/Loading"
import Footer from "../component/Footer"
import { CategoryItem } from "../component/Product/Product"
import getDataFromCollection from "../Utils/dataFetch/getDataFromCollection"
import api from "../Services/api"

const CategoryItems = () => {
  const { categoryId } = useParams(); // This is the slug (e.g., 'mobile-parts')
  const [categoryItemData, setCategoryItemData] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch all active products and filter by slug locally to handle deep links
        const response = await api.get('/products');
        const data = response.data;
        
        const filtered = data.filter(p => {
            const slug = (p.categoryName || '').toLowerCase().replace(/\s+/g, '-');
            return slug === categoryId;
        });

        const transformed = filtered.map(item => ({
          ...item,
          imgUrl: item.imageFilename ? `/api/uploads/${item.imageFilename}` : 'https://placehold.co/500x600?text=No+Image',
          name: item.brandName || 'Generic',
          product: item.categoryName || 'Product',
          title: item.name || 'Product',
          rating: item.avgRating || 4.5,
          price: item.price
        }));
        
        setCategoryItemData(transformed);

        // Fetch category title from the central collection
        getDataFromCollection('category', (categories) => {
          const found = categories.find(c => c.CategoryId === categoryId);
          if (found) setCategoryTitle(found.title);
          setLoading(false);
        });
      } catch (err) {
        console.error("Failed to fetch category items:", err);
        setLoading(false);
      }
    };

    fetchCategoryData();
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
                imgUrl={item.imgUrl}
                name={item.name}
                product={item.product}
                rating={item.rating || 4.5}
                reviews="12 reviews"
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
