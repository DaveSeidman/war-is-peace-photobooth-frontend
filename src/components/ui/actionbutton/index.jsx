import React from "react";
import actionButtonBackground from '../../../assets/images/action-button-background.svg';
import './index.scss';

export default function ActionButton({ countdown, originalPhoto, setCountdown }) {
  return (
    <div className="actionbutton">
      <img className="actionbutton-background" src={actionButtonBackground} />
      <div className="actionbutton-foreground">
        {(!countdown && !originalPhoto) && (<button
          onClick={() => setCountdown(true)}
        >Engage</button>)}
      </div>
    </div>
  )
}
