import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "./assets/logo.png";
import cart_icon from "./assets/cart_icon.png";
import { ShopContext } from "../Context/ShopContext";

export default function Navbar() {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate(); // Initialize useNavigate

  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  // Handle login/logout
  const handleAuthClick = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // User is logged in; handle logout
      localStorage.removeItem('authToken');
      window.location.reload(); // Reload to update navbar
      navigate('/'); // Redirect to home
    } else {
      // User is not logged in; navigate to login page
      navigate('/login');
    }
  };

  const Forli =
    "flex flex-col items-center justify-center gap-3 cursor-pointer";
  return (
    <div className="flex justify-around p-[16px] shadow-[0_1px_3px_-2px_rgba(0,0,0,0.5)] items-center">
      <div className="flex items-center gap-10">
        <img src={logo} alt="" />
        <Link to="/">
          <p className="text-[#171717] text-[38px] font-semibold cursor-pointer">
            SHOPPER
          </p>
        </Link>
      </div>
      <ul className="flex items-center list-none gap-[50px] text-[#626262] text-[20px] font-medium">
        <li
          onClick={() => {
            setMenu("shop");
          }}
          className={Forli}
        >
          <Link to="/">Shop</Link>
          {menu === "shop" && <hr className="border-none w-[80%] h-[3px] rounded-[10px] bg-[#FF4141]" />}
        </li>
        <li
          onClick={() => {
            setMenu("mens");
          }}
          className={Forli}
        >
          <Link to="/mens">Men</Link>
          {menu === "mens" && <hr className="border-none w-[80%] h-[3px] rounded-[10px] bg-[#FF4141]" />}
        </li>
        <li
          onClick={() => {
            setMenu("womens");
          }}
          className={Forli}
        >
          <Link to="/womens">Women</Link>
          {menu === "womens" && <hr className="border-none w-[80%] h-[3px] rounded-[10px] bg-[#FF4141]" />}
        </li>
        <li
          onClick={() => {
            setMenu("kids");
          }}
          className={Forli}
        >
          <Link to="/kids">Kids</Link>
          {menu === "kids" && <hr className="border-none w-[80%] h-[3px] rounded-[10px] bg-[#FF4141]" />}
        </li>
      </ul>
      <div className="flex items-center gap-[45px]">
        {/* Login/Logout button */}
        <button
          onClick={handleAuthClick}
          className="w-[157px] h-[58px] outline-none border border-gray-500 rounded-[75px] text-[#515151] text-[20px] font-medium bg-white cursor-pointer active:bg-slate-500"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
        {/* Add Profile Section */}
        {isLoggedIn && (
          <button
            onClick={() => navigate("/profile")} // Redirect to profile page
            className="bg-gradient-to-r from-red-400 via-purple-500 to-blue-300 
               rounded-full h-10 w-10 flex items-center justify-center 
               transition-all ease-in-out duration-200 hover:scale-105"
          >
            <span className="text-white font-bold">S</span>
          </button>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="w-[22px] h-[22px] flex items-center justify-center mt-[-35px] ml-[-55px] rounded-[11px] text-[14px] bg-red-400 text-white">
          {getTotalCartItems()}
        </div>
      </div>
    </div>
  );
}
