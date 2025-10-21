import React, { useState, useRef, useEffect } from "react";
import testVideo from '../../assets/videos/test.mp4';
import "./index.scss";

export default function Camera({ takePhoto, setTakePhoto, setOriginalPhoto, setOriginalBlob }) {
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  const toggleCamera = async () => {
    if (!cameraStarted) {
      // Start webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.loop = false; // stop looping the background video
      setCameraStarted(true);
    } else {
      // Stop webcam
      const stream = videoRef.current.srcObject;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Clear webcam feed
      videoRef.current.srcObject = null;

      // Reset to your test video and resume playback
      videoRef.current.src = testVideo;
      videoRef.current.loop = true;
      await videoRef.current.play().catch(() => { }); // avoid unhandled promise errors

      setCameraStarted(false);
    }
  };


  useEffect(() => {

    const ctx = canvasRef.current.getContext('2d');

    const draw = () => {
      // console.log('draw')
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    const gotoRandomTime = () => {
      videoRef.current.currentTime = Math.random() * videoRef.current.duration;
      videoRef.current.removeEventListener('canplaythrough', gotoRandomTime)
    }
    // start the fallback video at a random spot
    videoRef.current.addEventListener('canplaythrough', gotoRandomTime)

    return () => {
      cancelAnimationFrame(frameRef.current);
      videoRef.current.removeEventListener('canplaythrough', gotoRandomTime)

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
      {<button className="camera-start" onClick={toggleCamera}>{cameraStarted ? 'stop camera' : 'start camera'}</button>}
    </div>
  );
}
