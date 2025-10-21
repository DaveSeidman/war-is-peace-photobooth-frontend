import React from "react";
import clocksVideo from '../../assets/videos/clocks.mp4';
import './index.scss';

export default function Loading({ loading }) {


  return (
    <div className={`loading ${loading ? '' : 'hidden'}`}>
      <video
        className="loading-video"
        muted
        autoPlay
        loop
        playsInline
      >
        <source src={clocksVideo} />
      </video>
      <div className="loading-text">
        <p>Loading Text Here...</p>
      </div>
    </div>
  )
}