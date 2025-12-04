import React from 'react'
import { useEffect, useState } from "react"
import Button from "./Button"
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const User = () => {

    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch current user ID to filter out from the list
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await api.get("/user/me", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setCurrentUserId(res.data.user._id);
            } catch (e) {
                console.error("Error fetching current user:", e);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect( () => {
        setLoading(true);
        api.get("/user/bulk", { params: { filter } })
        .then(response => {
            // Filter out the current user from the list
            const filteredUsers = response.data.user.filter(
                user => user._id !== currentUserId
            );
            setUsers(filteredUsers);
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [filter, currentUserId])


  return (
    <>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Users
            </div>
        </div>
        <div className="mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    onChange={(e) => {
                        setFilter(e.target.value)
                    }} 
                    type="text" 
                    placeholder="Search users by name..." 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                />
            </div>
        </div>
        <div className="space-y-3">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-lg">No users found</p>
                    {filter && <p className="text-sm mt-2">Try a different search term</p>}
                </div>
            ) : (
                users.map(user => <UserRow key={user._id} user={user} />)
            )}
        </div>
    </>
  )

  function UserRow({user}) {
    const navigate = useNavigate();
    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "?";
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-green-500 to-green-600",
      "from-yellow-500 to-yellow-600",
    ];
    const colorIndex = (user.firstName?.charCodeAt(0) || 0) % colors.length;
    
    return (
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white hover:bg-blue-50/50 group">
        <div className="flex items-center gap-4 flex-1">
            <div className={`rounded-full h-14 w-14 bg-gradient-to-br ${colors[colorIndex]} flex justify-center items-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                <div className="text-white font-bold text-lg">
                    {initials}
                </div>
            </div>
            <div className="flex flex-col justify-center flex-1">
                <div className="font-semibold text-gray-800 text-lg">
                    {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.username}
                </div>
            </div>
        </div>

        <div className="ml-4">
            <Button onClick={(e) => {
                navigate(`/send?id=${user._id}&name=${user.firstName}`)
            }} label={"Send Money"} />
        </div>
    </div>
    );
}
}

export default User