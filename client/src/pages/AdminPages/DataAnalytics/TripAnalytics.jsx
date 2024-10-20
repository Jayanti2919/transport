import React from 'react';
import AdminSideNav from '../../../components/AdminSideNav';

const TripAnalytics = () => {
  return (
    <div className='relative'>
        <AdminSideNav fleetMgmt={false} dataAnalytics={true} active="trip analytics"/>
    </div>
  )
}

export default TripAnalytics