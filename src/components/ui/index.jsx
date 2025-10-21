import React, { useState, useRef, useEffect } from "react";
import frame from '../../assets/images/frame4.svg';
import './index.scss';

export default function UI({
  setCountdown,
  countdown,
  originalPhoto,
}) {


  return (
    <div className="ui">
      <button
        className={`ui-capture ${countdown || originalPhoto ? 'hidden' : ''}`}
        onClick={() => setCountdown(true)}
      >
        Take Photo!
      </button>
      <img className="ui-frame" src={frame} />
    </div>
  )
}