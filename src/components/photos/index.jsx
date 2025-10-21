// TODO: add some sort of visual countdown around the QR code or more generally
// so guests know that the booth will reset x-seconds after the QR code is displayed

import React from "react";
import { QRCode } from 'react-qrcode'

import './index.scss';

export default function Photos({ basename, photoId, pastPhoto, originalPhoto, futurePhoto }) {

  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? location.href
    : `http://${location.hostname}:8080`

  // this is the link that takes us to the correct takeaway site with the photoId
  const link = `${BACKEND_URL}/#/takeaway/${photoId}`;
  return (
    <div className="photos">
      <div className="photos-frame">
        <div className={`photos-frame-image past ${pastPhoto ? '' : 'hidden'}`}  ><img src={pastPhoto} /></div>
        <div className={`photos-frame-image present ${originalPhoto ? '' : 'hidden'}`} ><img src={originalPhoto} /></div>
        <div className={`photos-frame-image future ${futurePhoto ? '' : 'hidden'}`} ><img src={futurePhoto} /></div>
        <div className={`photos-frame-download ${photoId ? '' : 'hidden'}`}>
          <a
            className="photos-download-link"
            href={`#/takeaway/${photoId}`}
            target="_blank"
          >
            <QRCode value={link} />
          </a>
        </div>
      </div>

    </div>
  )
}