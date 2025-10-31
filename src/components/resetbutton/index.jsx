import React from "react";
import resetButtonBackground from '../../assets/images/action-button-background.svg';
import './index.scss';

export default function ResetButton({ label, active, action, placement }) {
  return (
    <div className={`resetbutton ${active ? '' : 'hidden'}`}>
      <div className="resetbutton-foreground">
        <button
          onClick={action}
        ></button>
      </div>
    </div>
  )
}
