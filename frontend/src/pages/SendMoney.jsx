import api from '../lib/api';
import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id")
  const name = searchParams.get("name");
  const [amount , setAmount] = useState(0);
  const [balance , setBalance] = useState(null);
  const [loadingBalance , setLoadingBalance] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    // Validate URL parameters
    if (!id || !name) {
      toast.error("Invalid user information. Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      return;
    }

    const fetchBalance = async () => {
      try{
        setLoadingBalance(true);
        const res = await api.get("/account/balance", {
          headers: {
            Authorization : "Bearer " + localStorage.getItem("token")
          }
        });
        setBalance(res.data.balance);
      } catch(e){
        console.error("Error fetching balance:", e);
        // Could show error message to user
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, [id, name, navigate]);

  return (

    <div className=' bg-slate-300 h-screen flex justify-center'>
      <div className=' flex flex-col justify-center'>
        <div className=' border h-min text-card-foreground max-w-md p-4 w-80 bg-white shadow-lg rounded-lg'>
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
        
          <div className=' p-6 flex items-center space-x-4'>
            <div className=' w-10 h-10 bg-green-500 rounded-full flex justify-center items-center'>
              <span className="text-2xl text-white">{(name?.[0] || "?").toUpperCase()}</span>
            </div>
            <div className=' text-2xl font-semibold '>
              {name}
            </div>
          </div>

          <div className=' px-6 pb-2'>
            <div className=' text-sm text-slate-600'>
              Current Balance:
            </div>
            <div className=' text-xl font-semibold'>
              {loadingBalance ? "Loading..." : (balance !== null ? `₹ ${balance.toFixed(2)}` : "—")}
            </div>
          </div>

          <div className=' space-y-4'>
            <div className=' space-y-2'>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="amount" >
                        Amount (in Rs)
            </label>
            <input onChange={(e) => {
              setAmount(e.target.value);
            }} type="number" placeholder='Enter Amount' className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button 
              onClick={async () => {
                const numericAmount = Number(amount);
                if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                  toast.error("Please enter a valid amount greater than 0.");
                  return;
                }
                
                setIsTransferring(true);
                const transferPromise = api.post("/account/transfer" , {
                  to: id,
                  amount: numericAmount
                }, {
                  headers: {
                    Authorization : "Bearer " + localStorage.getItem("token")
                  }
                });

                toast.promise(
                  transferPromise,
                  {
                    loading: 'Processing transfer...',
                    success: (data) => {
                      // Refresh balance after successful transfer
                      api.get("/account/balance", {
                        headers: {
                          Authorization : "Bearer " + localStorage.getItem("token")
                        }
                      })
                      .then(res => {
                        setBalance(res.data.balance);
                      })
                      .catch(e => {
                        console.error("Error refreshing balance:", e);
                      });
                      
                      // Clear the amount input
                      setAmount(0);
                      
                      return `Successfully transferred ₹${numericAmount.toFixed(2)} to ${name}!`;
                    },
                    error: (err) => {
                      return err?.response?.data?.message || "Transfer failed. Please try again.";
                    },
                  },
                  {
                    style: {
                      minWidth: '300px',
                    },
                    success: {
                      duration: 5000,
                      icon: '✅',
                    },
                    error: {
                      duration: 5000,
                      icon: '❌',
                    },
                  }
                );

                try {
                  await transferPromise;
                } catch (err) {
                  // Error is handled by toast.promise
                } finally {
                  setIsTransferring(false);
                }
              }}
              disabled={isTransferring}
              className={`
                justify-center rounded-md shadow-lg text-sm font-medium 
                ring-offset-background transition-all duration-200
                h-10 px-4 py-2 w-full
                ${isTransferring 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 hover:shadow-2xl active:scale-95'
                }
                text-white
              `}
            >
              {isTransferring ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Initiate Transfer'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SendMoney