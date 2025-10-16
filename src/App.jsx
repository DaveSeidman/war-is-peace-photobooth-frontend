import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UI from './components/ui';
import Camera from './components/camera';
import Countdown from './components/countdown';
import Attract from './components/attract';
import Idle from './components/idle';
import './index.scss';

const App = () => {

  const [attract, setAttract] = useState(true);
  const [idle, setIdle] = useState(false);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [takePhoto, setTakePhoto] = useState(false);
  const [originalPhoto, setOriginalPhoto] = useState();
  const [originalPhotoBlob, setOriginalBlob] = useState();
  const [alteredPhoto, setAlteredPhoto] = useState();
  const [awaitingEdit, setAwaitingEdit] = useState(false);

  const IDLE_DELAY = 60000;
  const ATTRACT_DELAY = 10000;
  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? 'https://war-is-peace-photobooth-backend.onrender.com'
    : 'http://localhost:8000'

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

  const uploadPhoto = async (photo) => {
    const url = `${BACKEND_URL}/edit/western`
    const data = new FormData();
    const options = { headers: { "Content-Type": "multipart/form-data" } }
    data.append("photo", photo, "photo.jpg");
    setAwaitingEdit(true);
    const response = await axios.post(url, data, options)
    setAwaitingEdit(false);
    if (!response.data.output) return console.log('no output')
    setAlteredPhoto(response.data.output.url)
  }

  useEffect(() => {
    if (originalPhoto) {
      setAlteredPhoto(null)
      uploadPhoto(originalPhotoBlob)
    }

  }, [originalPhotoBlob])


  useEffect(() => {
    addEventListener('click', resetIdleTimeout);
    return (() => { removeEventListener('click', resetIdleTimeout); })
  }, [])

  return (
    <div className="app">
      <Camera
        started={started}
        setStarted={setStarted}
        takePhoto={takePhoto}
        setTakePhoto={setTakePhoto}
        // TODO: move these out
        setOriginalPhoto={setOriginalPhoto}
        setOriginalBlob={setOriginalBlob}
      />
      <UI
        // started={started}
        // originalPhoto={originalPhoto}
        // alteredPhoto={alteredPhoto}
        setCountdown={setCountdown}
        awaitingEdit={awaitingEdit}

      />
      <Countdown
        countdown={countdown}
        setCountdown={setCountdown}
        setTakePhoto={setTakePhoto}
      />
      <Attract attract={attract} />
      <Idle idle={idle} />
    </div>
  );
};

export default App;
