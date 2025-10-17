import React from "react";
import { QRCode } from 'react-qrcode'

import './index.scss';

export default function Photos({ basename, photoId, pastPhoto, originalPhoto, futurePhoto }) {

  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? location.hostname
    : `http://${location.hostname}:8080`

  // this is the link that takes us to the correct takeaway site with the photoId

  const link = `${BACKEND_URL}/#/takeaway/${photoId}`;
  return (
    <div className="photos">
      <div className="photos-strip">
        <img className="photos-strip-past" src={pastPhoto} />
        <img className="photos--strip-present" src={originalPhoto} />
        <img className="photos-strip-future" src={futurePhoto} />
      </div>
      <div className={`photos-download ${photoId ? '' : 'hidden'}`}>
        <a
          className="photos-download-link"
          href={`#/takeaway/${photoId}`}
          target="_blank"
        >
          <QRCode value={link} />
        </a>
      </div>
    </div>
  )
}