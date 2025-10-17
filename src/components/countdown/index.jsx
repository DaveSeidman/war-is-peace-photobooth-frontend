import React, { useState, useRef, useEffect } from "react";
import './index.scss';

export default function Countdown({ countdown, setCountdown, setTakePhoto }) {
  const countdownInterval = useRef();
  const [count, setCount] = useState(3);

  const tick = () => {
    setCount((prev) => Math.max(prev - 1, 0));
  }

  useEffect(() => {
    if (countdown) {
      setCount(3);
      countdownInterval.current = setInterval(tick, 1000);
    }

    return (() => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    })
  }, [countdown])

  useEffect(() => {
    if (count <= 0) {
      setTakePhoto(true);
      setCountdown(false);
    }
  }, [count])

  return (
    <div className={`countdown ${countdown ? '' : 'hidden'}`}>
      <p className="countdown-timer">Countdown: {count}</p>
    </div>
  )
}