import React from 'react';
import AdminSideNav from '../../../components/AdminSideNav';

const DriverPerformance = () => {
  return (
    <div className='relative'>
        <AdminSideNav active="driver performance" fleetMgmt={false} dataAnalytics={true}/>
    </div>
  )
}

export default DriverPerformance