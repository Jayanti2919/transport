import React from 'react';
import { loginvideo } from '../assets';

const VideoBg = () => {
  return (
    <div className="absolute inset-0">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted>
          <source
            src={loginvideo}
            type="video/mp4"
          />
        </video>
      </div>
  )
}

export default VideoBg