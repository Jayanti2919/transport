import React from 'react';
import AdminSideNav from '../../../components/AdminSideNav';

const BookingData = () => {
  return (
    <div className='relative'>
        <AdminSideNav fleetMgmt={true} dataAnalytics={false} active="booking data"/>
    </div>
  )
}

export default BookingData