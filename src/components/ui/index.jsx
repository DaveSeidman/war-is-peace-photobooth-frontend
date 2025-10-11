import React, { useState, useRef, useEffect } from "react";
import './index.scss';

export default function UI({ started, originalPhoto, alteredPhoto, setTakePhoto, awaitingEdit }) {


  return (
    <div className="ui">
      {started && (
        <button
          className="ui-capture"
          onClick={() => setTakePhoto(true)}
        >
          Take Photo!
        </button>
      )}

      <div className="ui-photos">
        {originalPhoto && (<img className="ui-photos-photo original" src={originalPhoto}></img>)}
        {alteredPhoto && (<img className="ui-photos-photo altered" src={alteredPhoto}></img>)}
      </div>

      {awaitingEdit && (<p className="ui-loading">Loading...</p>)}
    </div>
  )
}