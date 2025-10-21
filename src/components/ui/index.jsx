import React, { useState, useRef, useEffect } from "react";
import frame from '../../assets/images/frame4.svg';
import Camcornder from "./camcorder";
import ActionButton from "./actionbutton";
import './index.scss';


export default function UI({ setCountdown, countdown, originalPhoto }) {

  return (
    <div className="ui">
      <img className="ui-frame" src={frame} />
      <Camcornder />
      <ActionButton
        setCountdown={setCountdown}
        countdown={countdown}
        originalPhoto={originalPhoto}
      />
    </div>
  )
}