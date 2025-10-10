import React, { useState, useRef } from "react";
import './index.scss';

export default function Camera() {
  const [started, setStarted] = useState(false);
  const videoRef = useRef()

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    videoRef.current.srcObject = stream;
    setStarted(true)
  }

  return (
    <div className="camera">

      <video
        className="camera-video"
        ref={videoRef}
        autoPlay
        playsInline
        muted
      >

      </video>

      {!started && (
        <button
          className="camera-start"
          onClick={startCamera}
        >startCamera</button>
      )}
    </div>
  )
}