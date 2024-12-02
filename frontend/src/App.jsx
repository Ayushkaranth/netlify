import { Navigate, Route, Routes } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import WatchPage from "./pages/watchPage.jsx"
import HomePage from "./pages/home/HomePage.jsx"
import Footer from "./components/Footer.jsx"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authUser.js"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import SearchPage from "./pages/SearchPage.jsx"
import SearchHistoryPage from "./pages/searchHistoryPage.jsx"
import NotFoundPage from "./pages/404.jsx"


function App() {
  const { user, isCheckingAuth, authCheck } =useAuthStore();
  console.log("auth user is here:",user);

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if(isCheckingAuth){
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full ">
          <Loader className="animate-spin text-red-600 w-10 h-10" />
        </div>
      </div>
    )
  }

  return (
  <>
  <Routes>
    <Route path="/" element={<HomePage />}></Route>
    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={"/"} />}></Route>
    <Route path="/signup" element={!user ?<SignupPage /> : <Navigate to={"/"} />}></Route>
    <Route path="/watch/:id" element={user ? <WatchPage /> : <Navigate to={"/login"} />}></Route>
    <Route path="/search" element={user ? <SearchPage /> : <Navigate to={"/login"} />}></Route>
    <Route path="/history" element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />}></Route>
    <Route path="/*" element={<NotFoundPage />}></Route>
  </Routes>
  
  <Footer />
  <Toaster />
  </>
  );
}

export default App;
