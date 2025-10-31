import React, { useState, useEffect } from 'react';
import './Capture.scss';

const Capture = ({ originalPhoto, trigger }) => {
  const [showFlash, setShowFlash] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [flyPath, setFlyPath] = useState('');

  // Generate random flight path
  const generateRandomPath = () => {
    const randomCoord = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const keyframes = `
      @keyframes flyAroundRandom {
        0% { translate: 0 0; }
        15% { translate: ${randomCoord(-15, 15)}vw ${randomCoord(-15, 15)}vh; }
        30% { translate: ${randomCoord(-15, 15)}vw ${randomCoord(-15, 15)}vh; }
        45% { translate: ${randomCoord(-15, 15)}vw ${randomCoord(-15, 15)}vh; }
        60% { translate: ${randomCoord(-15, 15)}vw ${randomCoord(-15, 15)}vh; }
        75% { translate: ${randomCoord(-15, 15)}vw ${randomCoord(-15, 15)}vh; }
        90% { translate: ${randomCoord(-15, 15)}vw ${randomCoord(-15, 15)}vh; }
        100% { translate: 0 0; }
      }
    `;
    return keyframes;
  };

  useEffect(() => {
    if (trigger && originalPhoto) {
      // Generate new random flight path
      setFlyPath(generateRandomPath());

      // Start with flash and photo simultaneously
      setShowFlash(true);
      setShowPhoto(true);

      // Hide flash after it completes
      setTimeout(() => {
        setShowFlash(false);
      }, 800);

      // Hide photo after animation completes
      setTimeout(() => {
        setShowPhoto(false);
      }, 3900); // 400ms flash overlap + 3500ms animation
    }
  }, [trigger, originalPhoto]);

  return (
    <div className="capture-overlay">
      {flyPath && <style>{flyPath}</style>}
      {showPhoto && originalPhoto && (
        <div className="photo-container">
          <img src={originalPhoto} alt="Captured" className="captured-photo" />
        </div>
      )}
      {showFlash && <div className="flash" />}
    </div>
  );
};

export default Capture;
