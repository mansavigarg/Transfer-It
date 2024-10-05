import { useState } from 'react'
import BottomWarning from '../components/BottomWarning'
import Button from '../components/Button'
import Heading from '../components/Heading'
import InputBox from '../components/InputBox'
import SubHeading from '../components/SubHeading'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
                const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                  username,
                  firstName,
                  lastName,
                  password
                });
                localStorage.setItem("token" , response.data.token)  // two items ("KEY" , value)
                navigate("/dashboard");
              }} label={"Sign Up"} />
            </div>
            <BottomWarning label={"Already have an Account?"} buttonText={"Sign in"} to={"/signin"}/>
        </div>
      </div>
    </div>
  )
}

export default Signup