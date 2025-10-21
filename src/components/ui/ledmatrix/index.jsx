import React from "react";
import backgroundImage from '../../../assets/images/ledmatrix-background.svg';
import './index.scss';

export default function LedMatrix({ active }) {

  return (
    <div className={`ledmatrix ${active ? '' : 'hidden'}`} >
      <img className="ledmatrix-background" src={backgroundImage} />
    </div>
  )
}