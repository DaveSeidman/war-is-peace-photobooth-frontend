import React from "react"
import iconPlay from '../../../assets/images/icon-play.svg'
import iconRecord from '../../../assets/images/icon-record.svg'
import './index.scss';

export default function Camcorder({ active }) {
  return (
    <div className={`camcorder ${active ? '' : 'hidden'}`}>
      {/* TODO: make all these "live" or at least respond to app state */}
      <div className="camcorder-topleft">
        <p>Play <img src={iconPlay} /></p>
        <p>Rec <img src={iconRecord} /></p>
      </div>
      <div className="camcorder-topright">
        <p>00: 00: 00: 00</p>
      </div>
      <div className="camcorder-bottomleft">
        <p>PM 04:20</p>
        <p>July. 25. 1999</p>
      </div>
      <div className="camcorder-bottomright"></div>
    </div>
  )
}