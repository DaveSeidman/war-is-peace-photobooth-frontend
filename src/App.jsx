import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import UI from './components/ui';
import Camera from './components/camera';
import Countdown from './components/countdown';
import Loading from './components/Loading';
import Photos from './components/photos';
import Attract from './components/attract';
import Idle from './components/idle';

import './index.scss';
import Takeaway from './components/takeaway';

const App = () => {

  const [attract, setAttract] = useState(true);
  const [idle, setIdle] = useState(false);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [takePhoto, setTakePhoto] = useState(false);
  const [originalPhoto, setOriginalPhoto] = useState();
  const [originalPhotoBlob, setOriginalBlob] = useState();
  const [photoId, setPhotoId] = useState();
  const [loading, setLoading] = useState(false);
  const [pastPhoto, setPastPhoto] = useState();
  const [futurePhoto, setFuturePhoto] = useState();

  const IDLE_DELAY = 60000;
  const ATTRACT_DELAY = 10000;
  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? 'https://war-is-peace-photobooth-backend.onrender.com'
    : `http://${location.hostname}:8000`
  const basename = 'war-is-peace-photobooth-frontend'
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
    const url = `${BACKEND_URL}/submit`
    const data = new FormData();
    const options = { headers: { "Content-Type": "multipart/form-data" } }
    data.append("photo", photo, "photo.jpg");
    setLoading(true);
    setPhotoId(null)
    const response = await axios.post(url, data, options)
    console.log(response)
    setLoading(false);
    if (!response.data.output) return console.log('no output')
    setPastPhoto(response.data.output.past)
    setFuturePhoto(response.data.output.future)
    setPhotoId(response.data.output.photoId);
    // setAlteredPhoto(response.data.output.url)
  }

  useEffect(() => {
    if (originalPhoto) {
      // setAlteredPhoto(null)
      uploadPhoto(originalPhotoBlob)
    }

  }, [originalPhotoBlob])

  useEffect(() => {
    if (attract) {
      setOriginalBlob(null);
      setOriginalPhoto(null);
      setPastPhoto(null);
      setFuturePhoto(null)
    }
  }, [attract])


  useEffect(() => {
    addEventListener('click', resetIdleTimeout);
    return (() => { removeEventListener('click', resetIdleTimeout); })
  }, [])

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Photos
                pastPhoto={pastPhoto}
                originalPhoto={originalPhoto}
                futurePhoto={futurePhoto}
                photoId={photoId}
                basename={basename}
              />
              <Camera
                started={started}
                setStarted={setStarted}
                takePhoto={takePhoto}
                setTakePhoto={setTakePhoto}
                setOriginalPhoto={setOriginalPhoto}
                setOriginalBlob={setOriginalBlob}
              />
              <UI
                setCountdown={setCountdown}
                countdown={countdown}
                originalPhoto={originalPhoto}
              />
              <Countdown
                countdown={countdown}
                setCountdown={setCountdown}
                setTakePhoto={setTakePhoto}
              />
              <Loading loading={loading} />
              <Attract attract={attract} />
              <Idle idle={idle} />
              {/* <a target="_blank" href={ style={{ position: 'absolute', bottom: 0, left: 0 }}>takeaway</a> */}
            </>
          } />
          <Route path="/takeaway/:photoId?" element={
            <Takeaway />
          } />
        </Routes>
      </Router>
    </div>

  );
};

export default App;
