import api from '../lib/api';
import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id")
  const name = searchParams.get("name");
  const [amount , setAmount] = useState(0);
  const [balance , setBalance] = useState(null);
  const [loadingBalance , setLoadingBalance] = useState(false);

  useEffect(() => {
    // Validate URL parameters
    if (!id || !name) {
      alert("Invalid user information. Redirecting to dashboard...");
      navigate("/dashboard");
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
            <button onClick={async () => {
              const numericAmount = Number(amount);
              if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                alert("Please enter a valid amount greater than 0.");
                return;
              }
              try {
                await api.post("/account/transfer" , {
                  to: id,
                  amount: numericAmount
                }, {
                  headers: {
                    Authorization : "Bearer " + localStorage.getItem("token")
                  }
                });
                alert("Transfer Successful");
                // Refresh balance after successful transfer
                try{
                  const res = await api.get("/account/balance", {
                    headers: {
                      Authorization : "Bearer " + localStorage.getItem("token")
                    }
                  });
                  setBalance(res.data.balance);
                } catch(e){
                  // ignore refresh failure silently
                }
              } catch (err) {
                const msg = err?.response?.data?.message || "Transfer failed";
                alert(msg);
              }
            }} className="justify-center rounded-md shadow-lg text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600 hover:shadow-2xl">
                        Initiate Transfer
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SendMoney