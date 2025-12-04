import React, { useEffect, useState } from 'react'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import User from '../components/User'
import api from '../lib/api'

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    fetchBalance();
  }, []);

  return (
    <div>
      <Appbar />
      <div className=' m-8'>
        <Balance value={loading || balance === null ? "Loading..." : Math.round(balance)} />
        <User />
      </div>
    </div>
  )
}

export default Dashboard