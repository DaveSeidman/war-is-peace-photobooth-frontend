// TODO: add some sort of visual countdown around the QR code or more generally
// so guests know that the booth will reset x-seconds after the QR code is displayed

import React from "react";
import { QRCode } from 'react-qrcode'
import ActionButton from "../actionbutton";
import Ticker from "../ticker";

import './index.scss';

export default function Photos({ reset, photoId, pastPhoto, originalPhoto, futurePhoto }) {

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
        <div className={`photos-frame-image present ${originalPhoto ? '' : 'hidden'}`}>
          <img className="phtoos-frame-image-photo" src={originalPhoto} />
          <div className="photos-frame-image-ticker">
            <Ticker
              datetime={now}
              color="red"
            />
          </div>
        </div>
        <div className={`photos-frame-image past ${pastPhoto ? '' : 'hidden'}`}>
          <img className="phtoos-frame-image-photo" src={pastPhoto} />
          <div className="photos-frame-image-ticker">
            <Ticker
              datetime={pastDatetime}
              color="green"
            />
          </div>
        </div>
        <div className={`photos-frame-image future ${futurePhoto ? '' : 'hidden'}`}>
          <img className="phtoos-frame-image-photo" src={futurePhoto} />
          <div className="photos-frame-image-ticker">

            <Ticker
              datetime={futureDateTime}
              color="yellow"
            />
          </div>
        </div>
        <div className={`photos-frame-download ${photoId ? '' : 'hidden'}`}>
          <a
            className="photos-frame-download-link"
            href={`#/takeaway/${photoId}`}
            target="_blank"
          >
            <QRCode
              value={link}
              color={{
                dark: '#b9b9b9',
                light: '#000000'
              }}
              margin={2}

            />
            Download
          </a>
          <ActionButton
            label="Reset"
            active={originalPhoto && pastPhoto && futurePhoto}
            placement="right"
            action={reset}
          />
        </div>
      </div>

    </div>
  )
}