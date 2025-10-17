import React from "react";
import { useParams } from "react-router-dom";
import './index.scss';

export default function Takeaway({ }) {
  const params = useParams();
  console.log(params)
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
          src={`${location.origin}/photos/${photoId}.jpg`}
        />
      )}
    </div>
  )
}