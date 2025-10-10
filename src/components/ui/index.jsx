import React, { useState, useRef, useEffect } from "react";
import './index.scss';

export default function UI({ started, attract, setTakePhoto }) {


  return (
    <div className="ui">
      <h1>UI</h1>
      {started && (<button
        className="ui-capture"
        onClick={() => setTakePhoto(true)}
      >
        Take Photo!
      </button>)}
    </div>
  )
}