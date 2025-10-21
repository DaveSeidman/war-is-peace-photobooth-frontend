import React from "react";
import Ticker from "../../ticker";
import './index.scss';

export default function TimeCurcuits({ active }) {

  return (
    <div className={`timecircuits ${active ? '' : 'hidden'}`}>
      <Ticker color="red" />
      <Ticker color="green" />
      <Ticker color="yellow" />
    </div>
  )
}