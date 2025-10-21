import React from "react";
import backgroundImage from '../../assets/images/ticker-background.svg';
import { format } from 'date-fns';

import './index.scss';

export default function Ticker({ datetime, color }) {

  const dateString = format(datetime, "MMM dd yyyy HH mm");

  return (
    <div className="ticker">
      <img className="ticker-background" src={backgroundImage} />
      <div className={`ticker-foreground ${color}`}>{dateString}</div>
    </div>
  )
}