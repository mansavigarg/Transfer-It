import axios from 'axios';
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id")
  const name = searchParams.get("name");
  const [amount , setAmount] = useState(0);

  return (

    <div className=' bg-slate-300 h-screen flex justify-center'>
      <div className=' flex flex-col justify-center'>
        <div className=' border h-min text-card-foreground max-w-md p-4 w-80 bg-white shadow-lg rounded-lg'>
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
        
          <div className=' p-6 flex items-center space-x-4'>
            <div className=' w-10 h-10 bg-green-500 rounded-full flex justify-center items-center'>
              <span class="text-2xl text-white">{name[0].toUpperCase()}</span>
            </div>
            <div className=' text-2xl font-semibold '>
              {name}
            </div>
          </div>

          <div className=' space-y-4'>
            <div className=' space-y-2'>
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="amount" >
                        Amount (in Rs)
            </label>
            <input onChange={(e) => {
              setAmount(e.target.value);
            }} type="number" placeholder='Enter Amount' class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button onClick={(e) => {
              axios.post("http://localhost:3000/api/v1/account/transfer" , {
                to: id,
                amount
              }, {
                headers: {
                  Authorization : "Bearer" + localStorage.getItem("token")
                }
              })
            }} class="justify-center rounded-md shadow-lg text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600 hover:shadow-2xl">
                        Initiate Transfer
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SendMoney