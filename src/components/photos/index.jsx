import React from "react";
import { QRCode } from 'react-qrcode'

import './index.scss';

export default function Photos({ downloadLink, pastPhoto, originalPhoto, futurePhoto }) {

  return (
    <div className="photos">
      <div className="photos-strip">
        <img className="photos-strip-past" src={pastPhoto} />
        <img className="photos--strip-present" src={originalPhoto} />
        <img className="photos-strip-future" src={futurePhoto} />
      </div>
      <div className="photos-download">
        <a
          className="photos-download-link"
          href={downloadLink}
          target="_blank"
        >
          <QRCode value={downloadLink} />
        </a>
      </div>
    </div>
  )
}