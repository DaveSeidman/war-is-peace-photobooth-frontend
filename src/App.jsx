import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import UI from './components/ui';
import Camera from './components/camera';
import Loading from './components/loading';
import Photos from './components/photos';
import Attract from './components/attract';
import Idle from './components/idle';
import Takeaway from './components/takeaway';
import { Leva, useControls } from 'leva';

import './index.scss';

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
  const [controls, setControls] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  // const [promptDefaults, setPromptDefaults] = useState(null);

  const IDLE_DELAY = 300000;
  const ATTRACT_DELAY = 10000;
  const BACKEND_URL = location.host === 'daveseidman.github.io'
    ? 'https://war-is-peace-photobooth-backend.onrender.com'
    : `http://${location.hostname}:8000`
  const basename = 'war-is-peace-photobooth-frontend'
  const idleTimeout = useRef();
  const attractTimeout = useRef();

  const [{ pastPrompt, futurePrompt, removePrompt }, set] = useControls(() => ({
    pastPrompt: { value: '' },
    futurePrompt: { value: '' },
    removePrompt: { value: '' },
  }));

  const reset = () => {
    setOriginalBlob(null)
    setOriginalPhoto(null)
    setPastPhoto(null)
    setFuturePhoto(null)
  }

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
    data.append("pastPrompt", pastPrompt);
    data.append("futurePrompt", futurePrompt);
    data.append("removePrompt", removePrompt);
    setLoading(true);
    setPhotoId(null)
    const response = await axios.post(url, data, options)
    console.log(response)
    setLoading(false);
    if (!response.data.output) return console.log('no output')
    setPastPhoto(response.data.output.past)
    setFuturePhoto(response.data.output.future)
    setPhotoId(response.data.output.photoId);
  }

  const keyDown = ({ key }) => {
    if (key === 'F1') setControls(prev => !prev);
  }

  const toggleFullscreen = () => {

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

  const handleFullscreenChange = () => {
    setFullscreen(document.fullscreenElement !== null);
  };

  useEffect(() => {
    addEventListener('click', resetIdleTimeout);
    addEventListener('keydown', keyDown);
    fetch(`${BACKEND_URL}/prompts`)
      .then(res => res.json())
      .then(data => {
        if (!data) return;
        console.log('prompts from server:', data);
        // safely apply values from server
        set({
          pastPrompt: data.past ?? '',
          futurePrompt: data.future ?? '',
          removePrompt: data.remove ?? '',
        });
      })
      .catch(err => console.log('Failed to load prompts'));

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return (() => {
      removeEventListener('click', resetIdleTimeout);
      removeEventListener('keydown', keyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    })
  }, [])

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Camera
                started={started}
                setStarted={setStarted}
                takePhoto={takePhoto}
                setTakePhoto={setTakePhoto}
                setOriginalPhoto={setOriginalPhoto}
                setOriginalBlob={setOriginalBlob}
              />
              <Photos
                pastPhoto={pastPhoto}
                originalPhoto={originalPhoto}
                futurePhoto={futurePhoto}
                photoId={photoId}
                reset={reset}
              />
              <UI
                countdown={countdown}
                setCountdown={setCountdown}
                setTakePhoto={setTakePhoto}
                originalPhoto={originalPhoto}
                pastPhoto={pastPhoto}
                attract={attract}
              />
              <Loading loading={loading} />
              <Attract attract={attract} />
              <Idle idle={idle} />
              <Leva
                hidden={!controls}
                theme={{
                  sizes: { rootWidth: '700px', controlWidth: '530px' },
                  space: { colGap: '12px' },
                  fontSizes: { root: '16px' },
                }}
              />
              {
                location.host === 'daveseidman.github.io' && !fullscreen && (
                  <button
                    type="button"
                    className="fullscreen"
                    onClick={async () => {
                      try {
                        await document.documentElement.requestFullscreen();
                        setFullscreen(true);
                      } catch (err) {
                        console.error("Failed to enter fullscreen:", err);
                      }
                    }}
                  >
                    Fullscreen
                  </button>
                )}
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
