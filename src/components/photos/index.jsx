// TODO: add some sort of visual countdown around the QR code or more generally
// so guests know that the booth will reset x-seconds after the QR code is displayed

import React from "react";
import { QRCode } from 'react-qrcode'
import Ticker from "../ticker";

import './index.scss';

export default function Photos({ basename, photoId, pastPhoto, originalPhoto, futurePhoto }) {

  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? location.href
    : `http://${location.hostname}:8080`

  const now = new Date();
  const pastDatetime = new Date().setFullYear(now.getFullYear() - 50);
  const futureDateTime = new Date().setFullYear(now.getFullYear() + 50);

  // this is the link that takes us to the correct takeaway site with the photoId
  const link = `${BACKEND_URL}/#/takeaway/${photoId}`;
  return (
    <div className={`photos ${originalPhoto ? '' : 'hidden'}`}>
      <div className="photos-frame">
        <div className={`photos-frame-image past ${pastPhoto ? '' : 'hidden'}`}>
          <img src={pastPhoto} />
          <Ticker datetime={pastDatetime} />
        </div>
        <div className={`photos-frame-image present ${originalPhoto ? '' : 'hidden'}`}>
          <img src={originalPhoto} />
          <Ticker datetime={now} />
        </div>
        <div className={`photos-frame-image future ${futurePhoto ? '' : 'hidden'}`}>
          <img src={futurePhoto} />
          <Ticker datetime={futureDateTime} />
        </div>
        <div className={`photos-frame-download ${photoId ? '' : 'hidden'}`}>
          <a
            className="photos-frame-download-link"
            href={`#/takeaway/${photoId}`}
            target="_blank"
          >
            <QRCode value={link} />
            Download
          </a>
          {/* <ResetButton /> */}
        </div>
      </div>

    </div>
  )
}