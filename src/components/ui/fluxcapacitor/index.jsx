import React from "react";
import backgroundImage from '../../../assets/images/flux-capacitor-background.svg';
import './index.scss';

export default function FluxCapacitor({ active }) {

  return (
    <div className={`fluxcapacitor ${active ? '' : 'hidden'}`}>
      <img className="fluxcapacitor-background" src={backgroundImage} />
    </div>
  )
}