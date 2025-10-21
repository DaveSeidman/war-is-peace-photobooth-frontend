import React, { useState, useRef, useEffect } from "react";
import frameImage from '../../assets/images/frame4.svg';
import logoImage from '../../assets/images/logo.png';
import Camcorder from "./camcorder";
import TimeCurcuits from "./timecircuits";
import LedMatrix from "./ledmatrix";
import FluxCapacitor from './fluxcapacitor';
import ActionButton from "../actionbutton"
import './index.scss';


export default function UI({ attract, countdown, setCountdown, setTakePhoto, originalPhoto }) {
  const countdownInterval = useRef();
  const [count, setCount] = useState();

  const tick = () => {
    setCount((prev) => Math.max(prev - 1, 0));
  }

  const takePhoto = () => {
    setCount(3)
    setCountdown(true);
  }

  useEffect(() => {
    if (countdown) {
      setCount(3);
      countdownInterval.current = setInterval(tick, 1000);
    }

    return (() => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    })
  }, [countdown])

  useEffect(() => {
    if (count <= 0) {
      setTakePhoto(true);
      setCountdown(false);
    }
  }, [count])

  return (
    <div className="ui">
      <img className="ui-frame" src={frameImage} />
      <img className="ui-logo" src={logoImage} />
      <Camcorder
        active={!countdown && !originalPhoto}
      />
      <TimeCurcuits
        active={!originalPhoto}
      />
      <LedMatrix
        active={!originalPhoto}
      />
      <FluxCapacitor
        active={!originalPhoto}
      />
      <ActionButton
        label={count || "engage"}
        placement="bottom"
        action={takePhoto}
        setCountdown={setCountdown}
        active={!originalPhoto && !attract}
      />
    </div>
  )
}