import React, { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className=' bg-slate-300 h-screen flex justify-center'>
      <div className=' flex flex-col justify-center'>
        <div className=' bg-white rounded-lg w-80 text-center p-3 h-max'>
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          
          <InputBox 
            onchange={e => setUsername(e.target.value)} 
            label={"Email"} 
            placeholder={"email@gmail.com"} 
          />
          <InputBox 
            onchange={e => setPassword(e.target.value)} 
            label={"Password"} 
            placeholder={"********"} 
          />
          
          <div className=' pt-3'>
            <Button 
              onClick={async () => {
                try {
                  // Basic client-side validation
                  if (!username || !password) {
                    toast.error("Please enter both email and password");
                    return;
                  }

                  // Basic email format check
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(username)) {
                    toast.error("Please enter a valid email address");
                    return;
                  }

                  const response = await api.post("/user/signin", {
                    username,
                    password
                  });
                  
                  localStorage.setItem("token", response.data.token);
                  toast.success("Signed in successfully!");
                  navigate("/dashboard");
                } catch (error) {
                  // Extract error message from response
                  const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";
                  toast.error(errorMessage);
                }
              }}
              label={"Sign In"} 
            />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"}/>
        </div>
      </div>
    </div>
  )
}

export default Signin