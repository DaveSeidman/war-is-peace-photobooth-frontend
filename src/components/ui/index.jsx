import React, { useState, useRef, useEffect } from "react";
import frameImage from '../../assets/images/frame4.svg';
import logoImage from '../../assets/images/logo.png';
import Camcornder from "./camcorder";
import ActionButton from "../actionbutton";
import './index.scss';


export default function UI({ setCountdown, countdown, originalPhoto, pastPhoto }) {

  const takePhoto = () => {
    setCountdown(true);
  }
  return (
    <div className="ui">
      <img className="ui-frame" src={frameImage} />
      <img className="ui-logo" src={logoImage} />
      <Camcornder
        countdown={countdown}
        originalPhoto={originalPhoto}
      />
      <ActionButton
        label="engage"
        placement="bottom"
        action={takePhoto}
        setCountdown={setCountdown}
        active={!countdown && !originalPhoto}
      />
    </div>
  )
}