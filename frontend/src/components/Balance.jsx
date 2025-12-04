import React, { useState, useEffect } from 'react'

const Balance = ({value}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === "Loading...") {
      setDisplayValue(0);
      return;
    }
    
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    
    // Animate the balance count-up
    setIsAnimating(true);
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, numericValue);
      setDisplayValue(Math.floor(current));
      
      if (step >= steps) {
        setDisplayValue(numericValue);
        setIsAnimating(false);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatCurrency = (amount) => {
    if (value === "Loading...") return "Loading...";
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-blue-100">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Your Balance
              </div>
              <div className={`text-5xl font-bold mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
                {value === "Loading..." ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-400">Loading...</span>
                  </div>
                ) : (
                  formatCurrency(displayValue)
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Available for transactions</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance