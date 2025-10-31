import { useEffect, useRef, useState } from 'react'
import './index.scss'
import idleVideo from '../../assets/videos/idle.webm'
import countdownVideo from '../../assets/videos/countdown.webm'
import loadingVideo from '../../assets/videos/loading.webm'
import resultsVideo from '../../assets/videos/results.webm'

// Video configuration for each state
const VIDEO_CONFIG = {
  idle: {
    src: idleVideo,
    loop: true,
    fade: false,
  },
  countdown: {
    src: countdownVideo,
    loop: false,
    fade: false,
  },
  loading: {
    src: loadingVideo,
    loop: true,
    fade: true, // Fade in/out quickly
  },
  results: {
    src: resultsVideo,
    loop: false,
    fade: false,
  },
}

export default function VideoOverlay({ state, onVideoEnd }) {
  // Create a video element for each state (preloaded)
  const idleVideoRef = useRef(null)
  const countdownVideoRef = useRef(null)
  const loadingVideoRef = useRef(null)
  const resultsVideoRef = useRef(null)
  const initializedRef = useRef(false)

  const [activeVideo, setActiveVideo] = useState(state || 'idle')
  const [currentState, setCurrentState] = useState(state)

  // Preload all videos on mount
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const videos = {
      idle: idleVideoRef.current,
      countdown: countdownVideoRef.current,
      loading: loadingVideoRef.current,
      results: resultsVideoRef.current,
    }

    // Preload all videos
    Object.entries(videos).forEach(([key, video]) => {
      if (video) {
        const config = VIDEO_CONFIG[key]
        video.src = config.src
        video.loop = config.loop
        video.preload = 'auto'
        video.load() // Force preload
      }
    })

    // Start playing the initial video after a brief delay
    setTimeout(() => {
      const initialVideo = videos[state || 'idle']
      if (initialVideo) {
        initialVideo.play().catch(err => {
          console.error('Initial video play failed:', err)
        })
      }
    }, 100)
  }, [])

  // Switch videos when state changes
  useEffect(() => {
    if (!state || !initializedRef.current) return

    const videos = {
      idle: idleVideoRef.current,
      countdown: countdownVideoRef.current,
      loading: loadingVideoRef.current,
      results: resultsVideoRef.current,
    }

    const currentVideo = videos[activeVideo]
    const nextVideo = videos[state]

    if (!nextVideo || state === activeVideo) return

    console.log(`Switching from ${activeVideo} to ${state}`)

    // Pause old video immediately
    if (currentVideo && currentVideo !== nextVideo) {
      currentVideo.pause()
    }

    // Start playing the next video and switch (instant cut)
    nextVideo.currentTime = 0
    nextVideo.play().catch(err => {
      console.error('Video play failed:', err)
    })

    // Switch active video (instant, no fade)
    setActiveVideo(state)
    setCurrentState(state)
  }, [state, activeVideo])

  const handleVideoEnd = (videoState) => {
    // Only trigger callback if this is the currently active video
    if (videoState === activeVideo && onVideoEnd) {
      onVideoEnd(currentState)
    }
  }

  return (
    <div className="video-overlay">
      <video
        ref={idleVideoRef}
        className={`${activeVideo === 'idle' ? 'active' : 'inactive'} ${VIDEO_CONFIG.idle.fade ? 'fade' : ''}`}
        onEnded={() => handleVideoEnd('idle')}
        playsInline
        muted
      />
      <video
        ref={countdownVideoRef}
        className={`${activeVideo === 'countdown' ? 'active' : 'inactive'} ${VIDEO_CONFIG.countdown.fade ? 'fade' : ''}`}
        onEnded={() => handleVideoEnd('countdown')}
        playsInline
        muted
      />
      <video
        ref={loadingVideoRef}
        className={`${activeVideo === 'loading' ? 'active' : 'inactive'} ${VIDEO_CONFIG.loading.fade ? 'fade' : ''}`}
        onEnded={() => console.log('Loading video ended, about to loop')}
        playsInline
        muted
      />
      <video
        ref={resultsVideoRef}
        className={`${activeVideo === 'results' ? 'active' : 'inactive'} ${VIDEO_CONFIG.results.fade ? 'fade' : ''}`}
        onEnded={() => handleVideoEnd('results')}
        playsInline
        muted
      />
    </div>
  )
}
