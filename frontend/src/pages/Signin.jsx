import React, { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

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
                const response = await api.post("/user/signin", {
                  username,
                  password
                });
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
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