import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Dashboard from "../Layouts/Dashboard";
import Home from "../Pages/home/Home";
import Login from "../Pages/login/Login";
import Register from "../Pages/register/Register";
import AllBooks from "../Pages/allBooks/AllBooks";


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
                element:<Login></Login>
            },
            {
                path: "register",
                element:<Register></Register>
            },
            {
                path: "all-books",
                element:<AllBooks></AllBooks>
            }
        ]
    },
    {
        path: "dashboard",
        element: <Dashboard></Dashboard>
    },
    {
        path: "*",
        element: <div className="text-3xl font-bold underline">404 Not Found</div>
    }
]);

export default router;