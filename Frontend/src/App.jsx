import Navbar from "./Components/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Shop from "./Context/pages/Shop";
import ShopCategory from "./Context/pages/ShopCategory";
import Product from "./Context/pages/Product";
import Cart from "./Context/pages/Cart";
import LoginSignup from "./Context/pages/LoginSignup";
import Footer from "./Components/Footer";
import men_banner from './Components/assets/banner_mens.png';
import women_banner from './Components/assets/banner_women.png';
import kid_banner from './Components/assets/banner_kids.png';
import SuccessPage from "./Context/pages/SuccessPage";
import Profile from "./Context/pages/Profile";
import OrderedItems from "./Context/pages/OrderedItems";

const AppContent = () => {
  const location = useLocation();
  const isSuccessPage = location.pathname === '/success';

  return (
    <div>
      {!isSuccessPage && <Navbar />}
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category='men' />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category='women' />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category='kid' />} />
          
          <Route path='/product/:productId' element={<Product />} />
          
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ordereditems" element={<OrderedItems />} />
        </Routes>
      {!isSuccessPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
