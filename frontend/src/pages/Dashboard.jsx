import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import User from '../components/User'
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

  // Refetch balance when navigating back to Dashboard
  useEffect(() => {
    fetchBalance();
  }, [location.pathname]);

  // Refetch balance when window regains focus (user comes back from SendMoney page)
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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <User />
        </div>
      </div>
    </div>
  )
}

export default Dashboard