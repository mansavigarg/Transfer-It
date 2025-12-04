import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../lib/api'

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/account/transactions", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setTransactions(res.data.transactions);
    } catch (e) {
      console.error("Error fetching transactions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Refetch transactions when navigating back to Dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      fetchTransactions();
    }
  }, [location.pathname]);

  // Refetch transactions when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchTransactions();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="text-lg font-medium">No transactions yet</p>
        <p className="text-sm mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((txn) => {
        const isSent = txn.type === 'sent';
        const otherUser = isSent ? txn.to : txn.from;
        const initials = otherUser.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || '?';

        const colors = [
          "from-blue-500 to-blue-600",
          "from-purple-500 to-purple-600",
          "from-pink-500 to-pink-600",
          "from-indigo-500 to-indigo-600",
          "from-green-500 to-green-600",
          "from-yellow-500 to-yellow-600",
        ];
        const colorIndex = (otherUser.name.charCodeAt(0) || 0) % colors.length;

        return (
          <div
            key={txn.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white group"
          >
            {/* Avatar */}
            <div className={`rounded-full h-12 w-12 bg-gradient-to-br ${colors[colorIndex]} flex justify-center items-center shadow-md flex-shrink-0`}>
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {isSent ? 'Sent to' : 'Received from'} {otherUser.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(txn.timestamp)}</span>
                    <span>•</span>
                    <span>{formatTime(txn.timestamp)}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className={`flex flex-col items-end flex-shrink-0 ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                  <div className="flex items-center gap-1">
                    {isSent ? "": ""}
                    <span className="font-bold text-lg">
                      {isSent ? '-' : '+'}₹{txn.amount.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {isSent ? 'Debited' : 'Credited'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionHistory;

