import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Camera from './components/camera';
import Photos from './components/photos';
import VideoOverlay from './components/videooverlay';
import EngageButton from './components/engagebutton';
import ResetButton from './components/resetbutton';
import Takeaway from './components/takeaway';
import Capture from './components/Capture';
import { Leva, useControls } from 'leva';

import './index.scss';

const App = () => {

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
  const [showResults, setShowResults] = useState(false);
  const [triggerCapture, setTriggerCapture] = useState(false);

  const RESET_DELAY = 92000; // 90 seconds
  const BACKEND_URL = location.host === 'war--is--peace.com'
    ? 'https://war-is-peace-photobooth-backend.onrender.com'
    : `http://${location.hostname}:8000`
  const basename = 'war-is-peace-photobooth-frontend'
  const resetTimeout = useRef();

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
    setShowResults(false)
    setTriggerCapture(false)
  }

  // Determine which video to show based on current state
  const getVideoState = () => {
    if (loading) return 'loading'
    if (originalPhoto && pastPhoto && futurePhoto) return 'results'
    if (countdown) return 'countdown'
    return 'idle' // default state
  }

  // Handle video end events
  const handleVideoEnd = (state) => {
    if (state === 'countdown') {
      // Countdown video finished, trigger capture animation and take photo
      setCountdown(false)
      setTriggerCapture(true)
      setTakePhoto(true)
    }
    // Results video ends but stays visible (photos show through transparent areas)
  }

  // Handle engage button click
  const handleEngage = () => {
    setCountdown(true)
  }

  const startResetTimer = () => {
    if (resetTimeout.current) clearTimeout(resetTimeout.current)

    console.log('Reset timer started - will reset in 1 minute');
    const startTime = Date.now();

    // Log every 30 seconds
    const logInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      console.log(`Reset timer: ${elapsed}s elapsed`);
    }, 30000);

    resetTimeout.current = setTimeout(() => {
      clearInterval(logInterval);
      console.log('Reset timer completed - resetting app');
      reset();
    }, RESET_DELAY);

    // Store interval so we can clear it if timer is restarted
    if (resetTimeout.logInterval) clearInterval(resetTimeout.logInterval);
    resetTimeout.logInterval = logInterval;
  }

  const uploadPhoto = async (photo) => {
    const url = `${BACKEND_URL}/submit`
    const data = new FormData();
    const options = { headers: { "Content-Type": "multipart/form-data" } }
    data.append("photo", photo, "photo.jpg");
    data.append("pastPrompt", pastPrompt);
    data.append("futurePrompt", futurePrompt);
    data.append("removePrompt", removePrompt);

    const startTime = Date.now();
    console.log('Loading started...');
    setLoading(true);
    setPhotoId(null)

    const response = await axios.post(url, data, options)
    const loadingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Loading completed in ${loadingTime}s`);
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


  // Trigger results animation when all photos are ready and start reset timer
  useEffect(() => {
    if (originalPhoto && pastPhoto && futurePhoto) {
      setShowResults(true);
      startResetTimer();
    }
  }, [originalPhoto, pastPhoto, futurePhoto])

  const handleFullscreenChange = () => {
    setFullscreen(document.fullscreenElement !== null);
  };

  useEffect(() => {
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
      removeEventListener('keydown', keyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      // Clean up timer on unmount
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      if (resetTimeout.logInterval) clearInterval(resetTimeout.logInterval);
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
                showResults={showResults}
              />
              {getVideoState() && (
                <VideoOverlay
                  state={getVideoState()}
                  onVideoEnd={handleVideoEnd}
                />
              )}
              <Capture
                originalPhoto={originalPhoto}
                trigger={triggerCapture}
              />
              <EngageButton
                active={!countdown && !loading && !originalPhoto}
                onClick={handleEngage}
              />
              <ResetButton
                label="Reset"
                active={originalPhoto && pastPhoto && futurePhoto}
                action={reset}
              />
              <Leva
                hidden={!controls}
                theme={{
                  sizes: { rootWidth: '700px', controlWidth: '530px' },
                  space: { colGap: '12px' },
                  fontSizes: { root: '16px' },
                }}
              />
              {
                location.host === 'war--is--peace.com' && !fullscreen && (
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
