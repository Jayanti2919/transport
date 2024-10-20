import React from 'react';
import AdminSideNav from '../../../components/AdminSideNav';

const DriverActivity = () => {
  return (
    <div className='relative'>
        <AdminSideNav fleetMgmt={true} dataAnalytics={false} active="driver activity"/>
    </div>
  )
}

export default DriverActivity