import { Navigate, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/home'
import Login from './pages/login'
import SignUp from './pages/signUp'
import Navbar from './components/Navbar'
import { use, useEffect } from 'react'
import { useUserStore } from './stores/userStore'
import LoadingSpinner from './components/LoadingSpinner'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccesPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	useEffect(() => {
		checkAuth();
	}, []);

	if (checkingAuth) {
		return <LoadingSpinner />;
	}

	return (
		<>
			<div className='min-h-screen bg-white text-gray-900 relative overflow-hidden'>
						<div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

						<div className='relative z-50 pt-20'>
        <Navbar />
		<Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={!user ? <Login /> : <Navigate to="/"/>} />
		  <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/"/>} />
		  <Route
				path='/secret-dashboard'
				element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
			/>
			<Route path='/category/:category' element={<CategoryPage />} />
			 <Route path='/cart' element={user ? <CartPage /> : <Navigate to="/login"/>} />
			<Route
				path='/purchase-success'
				element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
			/>
			<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        </Routes>
			</div>
			<Toaster />
		</div>
    </>
  )
}

export default App
