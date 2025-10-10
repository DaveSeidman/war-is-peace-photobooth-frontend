import React, { useState, useEffect, useRef } from 'react';
import UI from './components/ui';
import Camera from './components/camera';
import Attract from './components/attract';
import Idle from './components/idle';
import './index.scss';

const App = () => {

  const [attract, setAttract] = useState(true);
  const [idle, setIdle] = useState(false);
  const [started, setStarted] = useState(false);
  const [takePhoto, setTakePhoto] = useState(false);
  const [photo, setPhoto] = useState();

  const IDLE_DELAY = 5000;
  const ATTRACT_DELAY = 5000;

  const idleTimeout = useRef();
  const attractTimeout = useRef();



  const resetIdleTimeout = () => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current)
    if (attractTimeout.current) clearTimeout(attractTimeout.current)

    setIdle(false);
    setAttract(false);

    idleTimeout.current = setTimeout(() => {
      setIdle(true);
      attractTimeout.current = setTimeout(() => {
        setAttract(true);
        setIdle(false)
      }, ATTRACT_DELAY);
    }, IDLE_DELAY);
  }

  useEffect(() => {

    addEventListener('click', resetIdleTimeout);

    return (() => {
      removeEventListener('click', resetIdleTimeout);
    })


  }, [])

  return (
    <div className="app">
      <Camera
        started={started}
        setStarted={setStarted}
        takePhoto={takePhoto}
        setTakePhoto={setTakePhoto}
        setPhoto={setPhoto}
      />
      <UI
        started={started}
        photo={photo}
        setTakePhoto={setTakePhoto}
      />
      <Attract attract={attract} />
      <Idle idle={idle} />
    </div>
  );
};

export default App;
