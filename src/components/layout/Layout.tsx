import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import "../../css/components/layout/Layout.css"

function Layout() {

    return(
        <>
           <Header />

           <main>
                <Outlet />
           </main>
           
           <Footer />
        </>
    )
}

export default Layout