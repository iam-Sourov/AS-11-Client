import { createBrowserRouter } from "react-router";

import RootLayout from "../Layouts/RootLayout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>
    }
]);

export default router;