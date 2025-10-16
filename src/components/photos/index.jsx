import React from "react";

import './index.scss';

export default function Photos({ pastPhoto, presentPhoto, futurePhoto }) {

  return (
    <div className="photos">

      <div className="photos-strip">
        <img className="photos-strip-past" src={pastPhoto} />
        <img className="photos--strip-present" src={presentPhoto} />
        <img className="photos-strip-future" src={futurePhoto} />
      </div>
    </div>
  )
}