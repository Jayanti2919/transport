import React from 'react';
import { IoIosCar } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";

const TripDisplayAdmin = ({trip}) => {
  return (
    <div className='flex items-center gap-2 py-2 cursor-pointer'>
        <IoIosCar className="text-2xl"/>
        <div>
            <span>Trip ID: {trip.id}</span>
            <div className='flex text-xs items-center text-accent gap-1'>
                <span>{trip.source}</span>
                <FaArrowRight/>
                <span>{trip.destination}</span>
            </div>
        </div>
    </div>
  )
}

export default TripDisplayAdmin