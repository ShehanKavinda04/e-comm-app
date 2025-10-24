import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Home from "./page/Home";
import Login from "./page/Login/Login";
import ItemPage from "./page/ItemPage";
import CategoryItems from "./page/CategoryItems";
import Category from "./component/category/Category";
import UserProtected from "./Routers/UserProtected";
import User from "./page/User/User";
import AdminProtected from "./Routers/AdminProtected";
import Admin from "./page/Admin/Admin";
import NoUrl from "./page/404/NoUrl";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/Firebase";
import { useDispatch } from "react-redux";
import getDataDocument from "./Utils/dataFetch/getDataDocument";
import { addUser, removeUser } from "./Store/ReduxSlice/userSlice";
import Card from "./page/card/Card";
import Seller from "./page/Seller/Seller";
import OTPPage from "./page/Login/OTPPage";
import Forgatepass1 from "./page/Login/Forgatepass1";
import Forgatepassword2 from "./page/Login/Forgatepassword2";

function App() {
  const dispatch = useDispatch();
  //const userData = useSelector(userSelector)

  useEffect(() => {
    const useCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;

        getDataDocument("users", uid, (dataSet) => {
          dispatch(addUser(dataSet));
          console.log("user have", dispatch);
        });
        // ...
      } else {
        // User is signed out
        // ...
        console.log("no user ");
        dispatch(removeUser());
      }
    });
    return useCheck;
    // eslint-disable-next-line
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/card",
          element: <Card />,
        },
        {
          path: "/seller",
          element: <Seller />,
        },
        {
          path: "category",
          children: [
            {
              index: true,
              element: <Category />,
            },
            {
              path: ":categoryId",
              children: [
                {
                  index: true,
                  element: <CategoryItems />,
                },
                {
                  path: ":itemId",
                  element: <ItemPage />,
                },
              ],
            },
          ],
        },
        {
          element: <UserProtected />,
          children: [
            {
              path: "profile",
              element: <User />,
            },
          ],
        },
      ],
    },
    {
      path: "/*",
      element: <NoUrl />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/otp",
      element: <OTPPage />,
    },
    {
      path: "/forgatepassword1",
      element: <Forgatepass1/>,
    },
    {
      path: "/forgatepassword2",
      element: <Forgatepassword2/>,
    },
    {
      element: <AdminProtected />,
      children: [
        {
          path: "/admin",
          element: <Admin />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
