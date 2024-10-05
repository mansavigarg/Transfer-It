import React from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'

const Signin = () => {
  return (
    <div className=' bg-slate-300 h-screen flex justify-center'>
      <div className=' flex flex-col justify-center'>
        <div className=' bg-white rounded-lg w-80 text-center p-3 h-max'>
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox label={"Email"} placeholder={"email@gmail.com"} />
          <InputBox label={"Password"} placeholder={"********"} />
          <div className=' pt-3'>
            <Button label={"Sign In"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"}/>
        </div>
      </div>
    </div>
  )
}

export default Signin