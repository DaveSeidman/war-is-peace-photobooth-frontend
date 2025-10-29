# Video Overlay Architecture

## Overview
The frontend has been rearchitected to use **MP4 video overlays** instead of static UI elements. Videos drive the visual experience while the camera feed plays underneath.

---

## Architecture Changes

### **Before** (Static UI)
```
Camera → Static UI Components (SVG) → Photos Grid
```

### **After** (Video Overlay)
```
Camera (z:1) → Photos (z:5) → Video Overlay (z:10) → Engage Button (z:20)
```

---

## Video State Machine

The app displays different videos based on state:

| State | Video | Loop | Trigger | Next State |
|-------|-------|------|---------|------------|
| `attract` | attract.mp4 | ✅ Yes | User clicks | → idle |
| `idle` | idle.mp4 | ✅ Yes | Click ENGAGE | → countdown |
| `countdown` | countdown.mp4 | ❌ No | Video ends (3s) | → loading |
| `loading` | loading.mp4 | ✅ Yes | Photos received | → results |
| `results` | results.mp4 | ❌ No | (stays visible) | Photos visible through transparency |

### State Logic
```javascript
// App.jsx:52-59
const getVideoState = () => {
  if (attract) return 'attract'
  if (idle) return 'idle'
  if (loading) return 'loading'
  if (originalPhoto && pastPhoto && futurePhoto) return 'results'
  if (countdown) return 'countdown'
  return 'idle' // default
}
```

---

## Component Layer Stack (Bottom → Top)

### **Layer 1: Camera** (z-index: 1)
- **File**: [src/components/camera/index.jsx](src/components/camera/index.jsx)
- **Purpose**: Webcam feed (always visible underneath everything)
- **CSS**: `z-index: 1`

### **Layer 2: Photos** (z-index: 5)
- **File**: [src/components/photos/index.jsx](src/components/photos/index.jsx)
- **Purpose**: Photo grid positioned behind results video
- **Behavior**:
  - Shows when `originalPhoto` exists
  - Images positioned absolutely to align with **transparent areas** in results.mp4
  - QR code and Reset button also positioned here
- **CSS**: `z-index: 5`
- **Layout**: 4 positioned elements:
  ```scss
  .present  { top: 10%; left: 5%; width: 40%; height: 40%; }
  .past     { top: 10%; right: 5%; width: 40%; height: 40%; }
  .future   { bottom: 10%; left: 5%; width: 40%; height: 40%; }
  .download { bottom: 10%; right: 5%; width: 40%; height: 40%; }
  ```
  **⚠️ TODO**: Adjust these positions to match actual transparent areas in your results.mp4

### **Layer 3: VideoOverlay** (z-index: 10)
- **File**: [src/components/videooverlay/index.jsx](src/components/videooverlay/index.jsx)
- **Purpose**: Displays state-based MP4 videos
- **Behavior**:
  - Switches video `src` when `state` prop changes (hard cut)
  - Calls `onVideoEnd` callback when non-looping videos finish
  - Full viewport, `object-fit: cover`
- **CSS**: `z-index: 10`, `pointer-events: none`

### **Layer 4: EngageButton** (z-index: 20)
- **File**: [src/components/engagebutton/index.jsx](src/components/engagebutton/index.jsx)
- **Purpose**: Transparent clickable overlay where ENGAGE appears in idle.mp4
- **Behavior**:
  - Only visible during idle state (`!attract && !countdown && !loading && !originalPhoto`)
  - Triggers countdown when clicked
- **CSS**: `z-index: 20`, positioned absolutely
  ```scss
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 80px;
  ```
  **⚠️ TODO**: Adjust position to match ENGAGE button location in your idle.mp4
  - **Debug tip**: Uncomment `background: rgba(255, 0, 0, 0.3)` to visualize clickable area

### **Layer 5: Leva Controls** (default z-index)
- Control panel for AI prompts (F1 to toggle)

### **Layer 6: Fullscreen Button** (z-index: 100)
- Only visible on production when not in fullscreen

---

## Video Files Required

Place these in `/assets/videos/`:

| File | Purpose | Loop | Duration |
|------|---------|------|----------|
| `attract.mp4` | Screensaver/advertising | Yes | Any |
| `idle.mp4` | Camera preview with UI elements + ENGAGE button | Yes | Any |
| `countdown.mp4` | 3...2...1 countdown animation | No | ~3 seconds |
| `loading.mp4` | "Processing..." animation | Yes | Any |
| `results.mp4` | Frame with 4 transparent areas for photos | No | 3-5 seconds |

### Video Specifications
- **Resolution**: Full viewport (recommend 1920×1080 or device native)
- **Format**: MP4 (H.264 codec)
- **Transparency**: results.mp4 needs **4 transparent rectangles** where photos will show through
- **Frame rate**: 30fps recommended

---

## User Flow

### 1. Attract Loop
- **Video**: `attract.mp4` (looping)
- **Action**: User clicks anywhere
- **Result**: → Idle state

### 2. Idle + Camera Preview
- **Video**: `idle.mp4` (looping, shows DeLorean UI + ENGAGE button)
- **Camera**: Webcam feed visible underneath video
- **Interactive**: Transparent EngageButton overlay
- **Action**: User clicks ENGAGE area
- **Result**: → Countdown

### 3. Countdown
- **Video**: `countdown.mp4` (plays once, 3...2...1)
- **Duration**: ~3 seconds (baked into video)
- **Event**: `onVideoEnd` → triggers photo capture
- **Result**: → Loading

### 4. Photo Capture + Upload
- **Automatic**: Photo captured when countdown ends
- **Video**: `loading.mp4` (looping)
- **Backend**: Upload + AI processing
- **Duration**: 15-60 seconds (variable)
- **Result**: → Results

### 5. Results Display
- **Video**: `results.mp4` (plays once, holds last frame)
- **Photos Layer**: Behind video, showing through transparent areas:
  - Top-left: Present photo + red ticker
  - Top-right: Past photo + green ticker
  - Bottom-left: Future photo + yellow ticker
  - Bottom-right: QR code + Reset button
- **Action**: User clicks Reset OR 5min idle timeout
- **Result**: → Attract

---

## State Transitions

```
ATTRACT (attract.mp4 loop)
    ↓ click anywhere
IDLE (idle.mp4 loop)
    ↓ click ENGAGE overlay
COUNTDOWN (countdown.mp4)
    ↓ video ends
CAPTURE (invisible, instant)
    ↓ photo captured
LOADING (loading.mp4 loop)
    ↓ backend responds
RESULTS (results.mp4 + photos behind)
    ↓ reset or 5min idle
ATTRACT (cycle repeats)
```

---

## Implementation Details

### Video Switching (Hard Cut)
```jsx
// videooverlay/index.jsx:30-39
useEffect(() => {
  const video = videoRef.current
  const config = VIDEO_CONFIG[state]

  video.src = config.src
  video.loop = config.loop
  video.play()
}, [state])
```

- Uses single `<video>` element
- Changes `src` attribute on state change
- **Transition**: Hard cut (instant)
- **Future Option**: Crossfade using dual video elements

### Video End Callbacks
```jsx
// App.jsx:62-69
const handleVideoEnd = (state) => {
  if (state === 'countdown') {
    setCountdown(false)
    setTakePhoto(true)
  }
}
```

Only `countdown.mp4` triggers action on end. Other videos either loop or stay visible.

### Photos Behind Video
The Photos component renders **behind** the VideoOverlay:
- Photos component: `z-index: 5`
- Video overlay: `z-index: 10`
- Result: Photos visible through transparent areas of results.mp4

---

## TODO Items

### Critical (Must Adjust Before Testing)

1. **Position Photos Layer** ([src/components/photos/index.scss:32-51](src/components/photos/index.scss))
   - Current positions are placeholders (10%, 5%, 40% sizes)
   - Measure transparent areas in your results.mp4
   - Update `.present`, `.past`, `.future`, `.download` positions to match exactly

2. **Position Engage Button** ([src/components/engagebutton/index.scss:6-11](src/components/engagebutton/index.scss))
   - Current position is placeholder (bottom: 15%, centered)
   - Measure ENGAGE button location in your idle.mp4
   - Update `bottom`, `left`, `width`, `height` to match

3. **Add Video Files**
   - Create or obtain: attract.mp4, idle.mp4, countdown.mp4, loading.mp4, results.mp4
   - Place in `/assets/videos/` directory
   - Ensure results.mp4 has proper transparent areas (alpha channel or use After Effects)

### Optional Improvements

4. **Crossfade Transition**
   - Replace hard cut with smooth crossfade
   - Implement dual-video approach (see ARCHITECTURE.md Option 1)

5. **Visual Feedback**
   - Add subtle hover state to EngageButton (currently minimal)
   - Add loading progress indicator
   - Add countdown timer on results screen (before auto-reset)

6. **Video Fallbacks**
   - Add error handling if video files don't load
   - Create static fallback frames as images

---

## Testing Checklist

- [ ] All 5 video files load correctly
- [ ] Attract → Idle transition works on click
- [ ] Engage button clickable area aligned with video
- [ ] Countdown video triggers photo capture on end
- [ ] Loading video loops during backend processing
- [ ] Photos appear in correct positions behind results video
- [ ] Photos visible through transparent areas
- [ ] QR code clickable and generates correct link
- [ ] Reset button works and returns to attract
- [ ] Idle timeout (5min) → attract transition
- [ ] Fullscreen button works on production

---

## Files Modified

### New Files
- `src/components/videooverlay/index.jsx` - Video overlay component
- `src/components/videooverlay/index.scss` - Video styling
- `src/components/engagebutton/index.jsx` - Transparent button overlay
- `src/components/engagebutton/index.scss` - Button positioning

### Modified Files
- `src/App.jsx` - Integrated VideoOverlay, removed old UI/Attract/Idle/Loading components
- `src/components/photos/index.scss` - Changed from grid to absolute positioning, z-index: 5
- `src/components/camera/index.scss` - Added z-index: 1
- `src/index.scss` - Added z-index to fullscreen button

### Removed Components (no longer used)
- `src/components/ui/` - Old static UI overlay
- `src/components/attract/` - Replaced by attract.mp4
- `src/components/idle/` - Replaced by idle.mp4
- `src/components/loading/` - Replaced by loading.mp4

---

## Video Production Tips

### Creating Transparent Areas in results.mp4

**Option 1: After Effects**
1. Create comp with transparent background
2. Add frame graphics/borders around 4 rectangles
3. Leave center areas transparent (checkboard pattern)
4. Export with **PNG+Alpha codec** or **ProRes 4444**
5. Convert to MP4 with transparency support

**Option 2: Green Screen + Remove**
1. Create video with green rectangles where photos should appear
2. Use JavaScript to remove green (`mix-blend-mode` or canvas)
3. More complex but works with standard MP4

**Option 3: CSS mask-image**
1. Create standard MP4 with dark/black areas for photos
2. Use CSS `mask-image` with SVG to cut holes
3. Applied to `.video-overlay` element

**Recommended**: Option 1 (After Effects with alpha) is cleanest and most flexible.

---

## Questions?

Contact implementation notes:
- Video switching: Cut vs crossfade trade-off documented
- Photos layer: Behind video to show through transparent areas
- Engage button: Transparent overlay positioned over video
- All timing baked into videos (countdown, results duration)
