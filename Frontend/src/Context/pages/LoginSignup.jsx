import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSignup, setIsSignup] = useState(false); // Start with Login page

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, agreeTerms } = formData;
    const newErrors = {};

    if (isSignup) {
      if (!name) newErrors.name = 'Name is required.';
      if (!email) newErrors.email = 'Email is required.';
      if (!password) newErrors.password = 'Password is required.';
      if (!agreeTerms) newErrors.agreeTerms = 'Please agree to terms and conditions.';
    } else {
      if (!email) newErrors.email = 'Email is required.';
      if (!password) newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const url = isSignup ? 'http://localhost:4000/signup' : 'http://localhost:4000/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Something went wrong', { autoClose: 3000 });
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      toast.success(isSignup ? 'Sign Up successful!' : 'Login successful!', { autoClose: 3000 });

      if (isSignup) {
        setTimeout(() => {
          setIsSignup(false); // Automatically redirect to Login page after 3 seconds
        }, 3000);
      } else {
        localStorage.setItem('authToken', data.token);
        setTimeout(() => {
          window.location.replace("/");
        }, 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-[100%] bg-lime-100 pt-[100px] pb-[30px]'>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='w-[580px] h-auto bg-white m-auto py-[40px] px-[60px]'>
        <h1 className='mx-[0px] font-bold text-[30px]'>{isSignup ? 'Sign Up' : 'Login'}</h1>
        <div className='flex flex-col gap-[29px] mt-[30px]'>
          {isSignup && (
            <>
              <input
                className='h-[72px] w-[100%] pl-[20px] border border-[#c9c9c9] outline-none text-gray-600 text-[18px]'
                type="text"
                name="name"
                placeholder='Your Name'
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </>
          )}
          <input
            className='h-[72px] w-[100%] pl-[20px] border border-[#c9c9c9] outline-none text-gray-600 text-[18px]'
            type="email"
            name="email"
            placeholder='Email Address'
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input
            className='h-[72px] w-[100%] pl-[20px] border border-[#c9c9c9] outline-none text-gray-600 text-[18px]'
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        {isSignup && (
          <div className='flex flex-col mt-[25px]'>
            <div className='flex items-center gap-[20px] text-slate-600 text-[16px] font-medium'>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <p>By Continuing, I agree to the terms of use & privacy policy.</p>
            </div>
            {errors.agreeTerms && <p className="text-red-500 mt-[5px]">{errors.agreeTerms}</p>}
          </div>
        )}
        <button type="submit" className='w-[480px] h-[66px] text-white bg-sky-400 mt-[30px] border-none text-[24px] font-medium cursor-pointer'>
          {isSignup ? 'Continue' : 'Login'}
        </button>
        
        <p className='mt-[20px] text-slate-600 text-[18px] font-medium'>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className='text-red-600 font-semibold cursor-pointer' onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login here' : 'Sign Up'}
          </span>
        </p>
        
      </form>
    </div>
  );
}
