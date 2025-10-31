import React from "react";
import { useParams } from "react-router-dom";
import { Leva } from "leva";
import './index.scss';

export default function Takeaway() {
  const BACKEND_URL = location.host === 'war--is--peace.com'
    ? 'https://war-is-peace-photobooth-backend.onrender.com'
    : `http://${location.hostname}:8000`;

  const { photoId } = useParams();
  const normalPhotoURL = photoId ? `${BACKEND_URL}/photos/${photoId}.jpg` : null;
  const trickPhotoURL = photoId ? `${BACKEND_URL}/photos/${photoId}.gif` : null;
  const handleShare = async () => {
    if (!normalPhotoURL || !navigator.share) {
      // fallback for browsers that don’t support the API
      window.open(normalPhotoURL, "_blank");
      return;
    }

    try {
      const response = await fetch(trickPhotoURL);
      const blob = await response.blob();
      const file = new File([blob], `${photoId}.gif`, { type: blob.type });

      await navigator.share({
        files: [file],
        title: 'War is Peace',
        text: 'It\'s like they were never born...',
      });
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  };

  return (
    <div className="takeaway">
      {normalPhotoURL ? (
        <>
          <img
            crossOrigin="anonymous"
            className="takeaway-photo"
            src={normalPhotoURL}
            alt="Your photo"
          />

          {/* Share Button (works natively on iOS/Android) */}
          <button className="takeaway-download" onClick={handleShare}>
          </button>
        </>
      ) : (
        <p>Sorry, we couldn't find your photo</p>
      )}
      <Leva hidden />
    </div>
  );
}
