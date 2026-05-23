import { useState } from 'react'
import BottomWarning from '../components/BottomWarning'
import Button from '../components/Button'
import Heading from '../components/Heading'
import InputBox from '../components/InputBox'
import SubHeading from '../components/SubHeading'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Signup = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  return (
    <div className=' bg-slate-300 h-screen flex justify-center'>
      <div className=' flex flex-col justify-center'>
        <div className=' w-80 rounded-lg bg-white p-4 h-max text-center px-4'>
            <Heading label={"Sign Up"} />
            <SubHeading label={"Enter your information to create an account"} />

            <InputBox onchange={e => {
              setFirstName(e.target.value);
            }} label={"First Name"} placeholder={"Jake"} />
            <InputBox onchange={e => {
              setLastName(e.target.value);
            }} label={"Last Name"} placeholder={"Garry"} />
            <InputBox onchange={e => {
              setUsername(e.target.value);
            }} label={"Email"} placeholder={"example@gmail.com"} />
            <InputBox onchange={e => {
              setPassword(e.target.value);
            }} label={"Password"} placeholder={"********"} />

            <div className=' pt-4'>
              <Button onClick={async () => {
                try {
                  // Basic client-side validation
                  if (!firstName || !lastName || !username || !password) {
                    toast.error("Please fill in all fields");
                    return;
                  }

                  // Basic email format check
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(username)) {
                    toast.error("Please enter a valid email address");
                    return;
                  }

                  // Basic password length check
                  if (password.length < 6) {
                    toast.error("Password must be at least 6 characters long");
                    return;
                  }

                  // Password complexity check
                  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
                  if (!passwordRegex.test(password)) {
                    toast.error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)");
                    return;
                  }

                  const response = await api.post("/user/signup", {
                    username,
                    firstName,
                    lastName,
                    password
                  });
                  
                  localStorage.setItem("token" , response.data.token);
                  toast.success("Account created successfully!");
                  navigate("/dashboard");
                } catch (error) {
                  // Extract error message from response
                  const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";
                  toast.error(errorMessage);
                }
              }} label={"Sign Up"} />
            </div>
            <BottomWarning label={"Already have an Account?"} buttonText={"Sign in"} to={"/signin"}/>
        </div>
      </div>
    </div>
  )
}

export default Signup