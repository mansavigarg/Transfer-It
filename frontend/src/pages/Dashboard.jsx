import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import User from '../components/User'
import TransactionHistory from '../components/TransactionHistory'
import api from '../lib/api'

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchBalance = async () => {
    try{
      setLoading(true);
      const res = await api.get("/account/balance", {
        headers: {
          Authorization : "Bearer " + localStorage.getItem("token")
        }
      });
      setBalance(res.data.balance);
    } catch(e){
      // optionally handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Refetch when navigating back to Dashboard
  useEffect(() => {
    fetchBalance();
  }, [location.pathname]);

  // Refetch when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchBalance();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Appbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Balance value={loading || balance === null ? "Loading..." : Math.round(balance)} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Users Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <User />
          </div>

          {/* Transaction History Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Recent Transactions
              </div>
            </div>
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard