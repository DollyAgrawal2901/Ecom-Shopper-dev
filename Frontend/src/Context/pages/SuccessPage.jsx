import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the counter has reached 0
    if (counter === 0) {
      // Navigate to the home page when the counter reaches 0
      navigate('/');
    }
  
    // Set up an interval that decreases the counter every second (1000 milliseconds)
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);
    // console.log(timer)
  
    // Clean up the interval when the component unmounts or the counter changes
    return () => clearInterval(timer);
  }, [counter, navigate]); // Dependency array: effect depends on `counter` and `navigate`
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
        <div className="bg-green-500 rounded-full p-4">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mt-6">
          Your payment is successful
        </h1>
        <p className="mt-4 text-gray-700">
          Redirecting to Home in {counter}...
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-red-700 text-white rounded-lg hover:opacity-90"
        >
          Home Page
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
