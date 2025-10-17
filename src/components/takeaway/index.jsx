import React from "react";
import { useParams } from "react-router-dom";
import './index.scss';

export default function Takeaway({ }) {
  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? 'https://war-is-peace-photobooth-backend.onrender.com'
    : `http://${location.hostname}:8000`


  const params = useParams();
  const { photoId } = params;

  return (
    <div className="takeaway">
      <div className="takeaway-title">
        <h1>Takeaway</h1>
        <p>{photoId}</p>
      </div>
      {photoId && (
        <img
          crossOrigin="anonymous"
          className="takeaway-photo"
          src={`${BACKEND_URL}/photos/${photoId}.jpg`}
        />
      )}
    </div>
  )
}