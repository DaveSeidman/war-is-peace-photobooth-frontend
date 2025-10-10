import React, { useState, useRef, useEffect } from "react";
import './index.scss';

export default function Idle({ idle }) {


  return (
    <div className={`idle ${idle ? '' : 'hidden'}`}>
      <p>Are you Still There?</p>
    </div>
  )
}