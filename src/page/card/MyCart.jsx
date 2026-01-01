import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/Footer';
import Header from './Header';
import EmptyCart from './EmptyCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../../Store/ReduxSlice/cartSlice';

const MyCart = () => {
  const { cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const updateQuantity = (id, change) => {
    // If change is positive, dispatch addToCart (which handles increment)
    // If change is negative, dispatch removeFromCart (which handles decrement)

    // Find the item to pass necessary details for addToCart if needed
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    if (change > 0) {
      dispatch(cartActions.addToCart({ ...item, price: item.price }));
    } else {
      dispatch(cartActions.removeFromCart(id));
    }
  };

  const removeItem = (id) => {
    dispatch(cartActions.deleteFromCart(id));
  };

  // Note: addToCart prop for Header handles adding NEW items from search results
  // We need to map the header's simple product structure to what our reducer expects
  const addToCartFromHeader = (product) => {
    dispatch(cartActions.addToCart({
      id: product.id,
      title: product.title,
      imgUrl: product.image,
      price: product.price
    }));
    setSearchQuery('');
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  // Searching within the cart (optional feature validation)
  // If we want to filter the visible cart items based on search:
  const filteredCartItems = cartItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // For the Header's autocomplete search, we typically search ALL products.
  // Since we removed the hardcoded `allProducts` array, the header search might need adjustment.
  // For now, we'll pass an empty array to filteredProducts or handle it differently if the user wants global search here.
  // Assuming the Header search was meant for local filtering based on previous code:
  // "const filteredProducts = allProducts.filter..."
  // If the user wants to search *within the cart*, we pass filteredCartItems.
  // If the user wants to search *globally* to add items, we need a global product list.
  // Given the context of "MyCart", searching usually means filtering current cart items OR finding new things to add.
  // The previous code had `allProducts` so it was likely "Search to Add". 
  // For now, I will pass [] as filteredProducts to disable "Search to Add" from header temporarily 
  // OR I can import getProducts() from service if needed. 
  // Let's stick to filtering the CART items for now as that's safer without `allProducts`.

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen mt-30 bg-gray-300 text-black">
      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          <Header
            totalItems={totalQuantity}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredProducts={[]} // Disabling "Search to Add" for now as we act on Redux Cart
            addToCart={addToCartFromHeader}
          />

          <div className="mb-6">
            {filteredCartItems.map((item) => (
              <CartItem
                key={item.id}
                image={item.image}
                title={item.title}
                subtitle={item.product || 'Product'} // Fallback if subtitle missing
                price={item.price}
                quantity={item.quantity}
                id={item.id}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}

            <CartSummary
              subtotal={totalAmount}
              handleProceedToCheckout={handleProceedToCheckout}
              isEmpty={isEmpty}
            />
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default MyCart;