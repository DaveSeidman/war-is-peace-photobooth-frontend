import React from "react";
import './index.scss';

export default function Loading({ loading }) {


  return (
    <div className={`loading ${loading ? '' : 'hidden'}`}>
      <h1>Loading...</h1>
    </div>
  )
}