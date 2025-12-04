import React, { useEffect, useState } from 'react'
import api from '../lib/api'

const Appbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        setUser(res.data.user);
      } catch (e) {
        console.error("Error fetching user:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getUserName = () => {
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`.trim() || user.username;
  };

  return (
    <div className='shadow-md h-16 flex justify-between items-center bg-white sticky top-0 z-50'>
        <div className='flex flex-col justify-center h-full ml-6'>
            <div className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                TransferIt
            </div>
        </div>
        <div className='flex items-center gap-3 mr-6'>
            {!loading && user && (
              <>
                <div className='flex flex-col justify-center'>
                    <div className='text-sm text-gray-600'>Hello,</div>
                    <div className='text-base font-semibold text-gray-800'>{getUserName()}</div>
                </div>
                <div className='rounded-full h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 flex justify-center items-center shadow-lg'>
                    <div className='text-white font-bold text-lg'>
                        {getInitials()}
                    </div>
                </div>
              </>
            )}
            {loading && (
              <div className='rounded-full h-12 w-12 bg-gray-200 animate-pulse'></div>
            )}
        </div>
    </div>
  )
}

export default Appbar