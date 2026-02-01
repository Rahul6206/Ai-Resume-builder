import AppRoutes from "./Routes/AppRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Footer from "./components/UserInterface/Footer"
import Navbar from "./components/UserInterface/Navbar"

function App() {

  return (
      <>
        <AppRoutes/>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </>
  )
}

export default App
