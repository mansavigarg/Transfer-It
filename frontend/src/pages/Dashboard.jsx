import React from 'react'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import User from '../components/User'

const Dashboard = () => {
  return (
    <div>
      <Appbar />
      <div className=' m-8'>
        <Balance value={12432} />
        <User />
      </div>
    </div>
  )
}

export default Dashboard