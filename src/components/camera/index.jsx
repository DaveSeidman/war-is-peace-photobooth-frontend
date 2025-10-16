import React, { useState, useRef, useEffect } from "react";
import testVideo from '../../assets/videos/test1.mp4';
import "./index.scss";

export default function Camera({ takePhoto, setTakePhoto, setOriginalPhoto, setOriginalBlob }) {
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  // const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    videoRef.current.srcObject = stream;
    setCameraStarted(true);
  };

  useEffect(() => {
    // if (!started) return;

    // startCamera();
    // console.log('here')
    const ctx = canvasRef.current.getContext('2d');

    const draw = () => {
      // console.log('draw')
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (takePhoto) {
      const canvas = canvasRef.current;

      // Convert to blob for upload (preferred over dataURL for large images)
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // optional: preview locally
        const localURL = URL.createObjectURL(blob);
        setOriginalPhoto(localURL);

        // Upload to your Node server
        setOriginalBlob(blob);
        setTakePhoto(false);
      }, "image/jpeg", 0.9); // adjust quality if needed
    }
  }, [takePhoto]);

  return (
    <div className="camera">
      <video
        className="camera-video"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop
      >
        <source src={testVideo} />
      </video>
      <canvas ref={canvasRef} className="camera-canvas" />
      {/* TODO add toggle to turn off camera as well */}
      {!cameraStarted && (<button className="camera-start" onClick={startCamera}>Start Camera</button>)}
    </div>
  );
}
