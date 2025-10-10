import React, { useState, useRef, useEffect } from "react";
import './index.scss';

export default function Attract({ attract }) {


  return (
    <div className={`attract ${attract ? '' : 'hidden'}`}>
      <h1>Attract State</h1>
    </div>
  )
}