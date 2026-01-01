import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Layouts
import MainLayout from "./layout/MainLayout";
import GlobalTransitionLayout from "./layout/GlobalTransitionLayout";

// Contexts
import { useContext, lazy, Suspense } from "react";
import { AuthContext } from "./Contexts/AuthContext";

// Lazy Imports
const Login = lazy(() => import("./page/Login/Login"));
const OTPPage = lazy(() => import("./page/Login/OTPPage"));
const Forgatepass1 = lazy(() => import("./page/Login/Forgatepass1"));
const Forgatepassword2 = lazy(() => import("./page/Login/Forgatepassword2"));

const Home = lazy(() => import("./page/Home"));
const Card = lazy(() => import("./page/card/Card"));
const MyCart = lazy(() => import("./page/card/MyCart"));
const ItemPage = lazy(() => import("./page/ItemPage"));
const CategoryItems = lazy(() => import("./page/CategoryItems"));
const CatalogPage = lazy(() => import("./page/CatalogPage"));
const NoUrl = lazy(() => import("./page/404/NoUrl"));

const Category = lazy(() => import("./component/Category/Category"));
const Product = lazy(() => import("./component/Product/Product"));
const Checkout = lazy(() => import("./page/Checkout/Checkout"));
const OrderSuccess = lazy(() => import("./page/Checkout/OrderSuccess"));

const User = lazy(() => import("./page/User/User"));
const Address = lazy(() => import("./page/ProfileDetails/address/Address"));
const UserProtected = lazy(() => import("./Routers/UserProtected"));

const Overview = lazy(() => import("./page/ProfileDetails/Overview"));
const MyOrder = lazy(() => import("./page/ProfileDetails/order/MyOrder"));
const UserProfile = lazy(() => import("./page/ProfileDetails/profile/UserProfile"));
const Wishlist = lazy(() => import("./page/ProfileDetails/Wishlist"));

const Seller = lazy(() => import("./page/Seller/Seller"));
const SellerRegistration = lazy(() => import("./page/Seller/SellerRegistration"));
const SellerProfile = lazy(() => import("./page/Seller/SellerProfile"));

const Admin = lazy(() => import("./page/Admin/Admin"));
const OrderDetails = lazy(() => import("./page/Admin/AdminSetting/order/OrderDetails"));
const UserDetails = lazy(() => import("./page/Admin/AdminSetting/userManagement/UserDetails"));
const EditUser = lazy(() => import("./page/Admin/AdminSetting/userManagement/EditUser"));
const AdminProtected = lazy(() => import("./Routers/AdminProtected"));
const PaymentMethod = lazy(() => import("./page/ProfileDetails/PaymentMethod"));

// Loading Component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-white">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
  </div>
);

// -----------------------------------------------------------------------------
// Route Guards
// -----------------------------------------------------------------------------

const SellerProtected = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "SELLER") return <Navigate to="/" replace />;

  return <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "SELLER") return <Navigate to="/seller" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      element: (
        <Suspense fallback={<PageLoader />}>
          <GlobalTransitionLayout />
        </Suspense>
      ),
      children: [
        // -------------------------------------------------------------------------
        // Auth Routes (Standalone)
        // -------------------------------------------------------------------------
        {
          path: "/login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          ),
        },
        { path: "/otp", element: <OTPPage /> },
        { path: "/forgatepassword1", element: <Forgatepass1 /> },
        { path: "/forgot-password", element: <Forgatepassword2 /> },


        // -------------------------------------------------------------------------
        // Main Application Routes (Main Layout)
        // -------------------------------------------------------------------------
        {
          path: "/",
          element: <MainLayout />,
          children: [
            { index: true, element: <Home /> },
            { path: "card", element: <Card /> },
            { path: "myCart", element: <MyCart /> },
            { path: "products", element: <Product /> }, // New Route
            { path: "checkout", element: <Checkout /> }, // New Route
            { path: "order-success", element: <OrderSuccess /> }, // New Route
            { path: "seller", element: <Seller /> },
            { path: "seller-registration", element: <SellerRegistration /> },
            { path: "sellerProfile", element: <SellerProfile /> },

            // Category Routes
            {
              path: "category",
              children: [
                { index: true, element: <CatalogPage /> },
                {
                  path: ":categoryId",
                  children: [
                    { index: true, element: <CategoryItems /> },
                    { path: ":itemId", element: <ItemPage /> },
                  ],
                },
              ],
            },

            // User Protected Routes
            {
              element: <UserProtected />,
              children: [
                {
                  path: "profile",
                  element: <User />,
                  children: [
                    { index: true, element: <Overview /> },
                    { path: "address", element: <Address /> },
                    { path: "orders", element: <MyOrder /> },
                    { path: "payment-methods", element: <PaymentMethod /> },
                    { path: "settings", element: <UserProfile /> },
                    { path: "wishlist", element: <Wishlist /> },
                  ],
                },
              ],
            },

            // Seller Protected Routes
            {
              element: <SellerProtected />,
              children: [
                { path: "seller/dashboard", element: <SellerProfile /> },
              ],
            },

            // Admin Routes (Moved inside MainLayout to show Header)
            {
              element: <AdminProtected />,
              children: [
                { path: "/admin", element: <Admin /> },
                { path: "/admin/order/:id", element: <OrderDetails /> },
                { path: "/admin/user/view/:id", element: <UserDetails /> },
                { path: "/admin/user/edit/:id", element: <EditUser /> },
              ],
            },
          ],
        },

        // -------------------------------------------------------------------------
        // Catch-All (404)
        // -------------------------------------------------------------------------
        { path: "*", element: <NoUrl /> },
      ],
    },
  ]);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
