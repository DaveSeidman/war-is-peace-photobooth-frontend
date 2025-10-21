import React from "react";
import actionButtonBackground from '../../assets/images/action-button-background.svg';
import './index.scss';

export default function ActionButton({ label, active, action, placement }) {
  return (
    <div className={`actionbutton ${active ? '' : 'hidden'} ${placement}`}>
      <img className="actionbutton-background" src={actionButtonBackground} />
      <div className="actionbutton-foreground">
        <button
          onClick={action}
        >{label}</button>
      </div>
    </div>
  )
}
