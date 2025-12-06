import { useContext } from 'react';
import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router';
import { Spinner } from "@/components/ui/spinner"
import { AuthContext } from '../contexts/AuthContext';
import Footer from '../components/footer/Footer';



const RootLayout = () => {
    const { loading } = useContext(AuthContext);

    return (

        <div className='min-h-screen '>
            <header>
                <Navbar></Navbar>
            </header>
            <main className=' min-h-[calc(100vh-200px)]'>
                {loading ? (
                    <div className='flex justify-center items-center h-full'>
                        <Spinner />
                    </div>
                ) : (
                    <Outlet></Outlet>
                )}
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div>

    );
};
export default RootLayout;