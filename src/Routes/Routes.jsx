import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Dashboard from "../Layouts/DashboardLayout";
import Home from "../Pages/home/Home";
import Login from "../Pages/login/Login";
import Register from "../Pages/register/Register";
import AllBooks from "../Pages/allBooks/AllBooks";
import AddBook from "../Pages/dashboards/librarian/Addbook";
import PrivateRoute from "./Private/PrivateRoutes";
import MyBooks from "../Pages/dashboards/librarian/MyBooks";
import Orders from "../Pages/dashboards/librarian/Orders";
import ManageBooks from "../Pages/dashboards/admin/ManageBooks";
import MyOrders from "../Pages/dashboards/user/MyOrders";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        errorElement: <div className="text-3xl font-bold underline">404 Not Found</div>,
        children: [
            {
                index: true,
                element: <Home></Home>,
            },
            {
                path: "login",
                element: <Login></Login>
            },
            {
                path: "register",
                element: <Register></Register>
            },
            {
                path: "all-books",
                element: <AllBooks></AllBooks>
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute>
            <Dashboard></Dashboard>
        </PrivateRoute>,
        children: [
            {
                path: "add-book",
                element: <PrivateRoute allowedRoles={['librarian', 'admin']}>
                    <AddBook></AddBook>
                </PrivateRoute>,
            },
            {
                path: "my-books",
                element: <PrivateRoute allowedRoles={['librarian', 'admin']}>
                    <MyBooks></MyBooks>
                </PrivateRoute>,
            },
            {
                path: "orders",
                element: <PrivateRoute allowedRoles={['librarian', 'admin']}>
                    <Orders></Orders>
                </PrivateRoute>,
            },
           
            {
                path: "my-orders",
                element: <PrivateRoute >
                    <MyOrders></MyOrders>
                </PrivateRoute>,
            },

            //     path: "my-profile",
            //     element: <PrivateRoute allowedRoles={['librarian', 'admin']}>
            //         <MyBooks></MyBooks>
            //     </PrivateRoute>,
            // }
        ]
    },
    {
        path: "*",
        element: <div className="text-3xl font-bold underline">404 Not Found</div>
    }
]);

export default router;