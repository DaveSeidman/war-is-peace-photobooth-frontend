import React, { useState, useRef, useEffect } from "react";
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
      {/* {awaitingEdit && (<p className="ui-loading">Loading...</p>)} */}
    </div>
  )
}