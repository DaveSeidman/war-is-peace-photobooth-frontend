import React, { useState, useRef, useEffect } from "react";
import './index.scss';

export default function UI({
  setCountdown,
  awaitingEdit
}) {


  return (
    <div className="ui">
      <button
        className="ui-capture"
        onClick={() => setCountdown(true)}
      >
        Take Photo!
      </button>
      {awaitingEdit && (<p className="ui-loading">Loading...</p>)}
    </div>
  )
}