import React from "react";
import backgroundImage from '../../assets/images/ticker-background.svg';
import { format } from 'date-fns';

import './index.scss';

export default function Ticker({ datetime, color }) {

  const dateString = format(datetime || new Date(), "MMM dd yyyy HH mm");
  // TODO: a ticker style animation for the digits would look nice here
  // try setting an initial value to be off by a random amount and then tween it to match datetime

  return (
    <div className="ticker">
      <img className="ticker-background" src={backgroundImage} />
      <div className={`ticker-foreground ${color}`}>{dateString}</div>
    </div>
  )
}