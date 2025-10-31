# 📸 War is Peace Photobooth - Architecture Documentation

## **Overview**
This is a **"Back to the Future"** themed AI photobooth with a DeLorean-inspired UI featuring time circuits, flux capacitor, camcorder overlay, and LED matrix elements. It takes a user's photo and generates three time-travel versions: **past** (-50 years), **present** (original), and **future** (+50 years). Users can scan a QR code to download their photos.

---

## **User Flow**

### 1. **Attract State** (Idle Advertising)
- Displayed when no one has interacted for **5 minutes idle + 10s attract delay**
- Shows "Attract State" message to grab attention
- All UI elements hidden during attract state
- **Location**: `src/components/attract/index.jsx`

### 2. **Idle Warning**
- Appears after **5 minutes of inactivity** (IDLE_DELAY = 300000ms)
- Prompts "Are you Still There?" before resetting
- **Location**: `src/components/idle/index.jsx`

### 3. **Camera Preview with UI Overlay**
- Video preview runs continuously (test video by default with randomized start time)
- DeLorean-themed UI overlay includes:
  - **Frame/Logo**: Visual branding
  - **Camcorder HUD**: Play/Rec indicators, timecode, date/time
  - **Time Circuits**: 3 color-coded tickers (red/green/yellow)
  - **LED Matrix**: Visual decoration
  - **Flux Capacitor**: Visual decoration
  - **Action Button**: "ENGAGE" button (changes to countdown numbers)
- User clicks "start camera" to enable webcam
- Canvas draws video frames in real-time for capture
- **Location**: `src/components/camera/index.jsx`, `src/components/ui/index.jsx`

### 4. **Photo Capture**
- User clicks **"ENGAGE"** action button
- **3-second countdown** begins (button shows "3", "2", "1")
- Countdown managed **within UI component** (moved from separate Countdown component)
- Photo captured as JPEG blob (0.9 quality)
- **Location**: `src/components/ui/index.jsx:16-41`

### 5. **AI Processing** (Backend)
- Original photo uploaded to backend at `/submit`
- Backend generates:
  - **Past photo** (-50 years, customizable via `pastPrompt`)
  - **Future photo** (+50 years, customizable via `futurePrompt`)
  - Subject extraction (uses `removePrompt`)
- **Location**: `src/App.jsx:69-86`

### 6. **Photo Grid Display**
- Shows 4-quadrant grid layout:
  - **Top-left**: Present photo + red ticker (current date/time)
  - **Top-right**: Past photo + green ticker (-50 years)
  - **Bottom-left**: Future photo + yellow ticker (+50 years)
  - **Bottom-right**: QR code for download + "Reset" button
- Tickers display formatted datetime: "MMM dd yyyy HH mm"
- Gray background with 30px gaps between quadrants
- Auto-resets to attract state after idle timeout
- **Location**: `src/components/photos/index.jsx`

### 7. **Takeaway Page**
- Mobile-optimized page accessed via QR code
- Displays full-res photo
- Native share sheet for saving/sharing
- Works on iOS/Android with Web Share API
- **Location**: `src/components/takeaway/index.jsx`

---

## **State Navigation Flow**

The app uses **conditional rendering** based on React state variables - it's **not** using route changes, but rather showing/hiding components with CSS classes and state flags.

### **State Machine in App.jsx**

**State variables** (`src/App.jsx:17-29`):
- `attract` - Shows attract screen (initial: `true`)
- `idle` - Shows "are you still there?" warning
- `countdown` - Triggers countdown in UI component
- `originalPhoto` - Stores captured photo (used to hide UI elements)
- `originalPhotoBlob` - Blob for upload
- `loading` - Shows loading spinner during AI processing
- `pastPhoto`, `futurePhoto` - AI-generated photos
- `photoId` - Enables QR code display when set
- `controls` - Toggles Leva control panel (F1 key)

### **Transition Flow**

#### **1. Attract → Idle → Attract Loop**
**Location**: `src/App.jsx:53-67` - Timeout management
- Click anywhere → `resetIdleTimeout()`
- After **5 minutes idle** → `setIdle(true)`
- After +10s more → `setAttract(true)`, `setIdle(false)`
- When attract triggers → calls `reset()` to clear all photos

#### **2. User Clicks "ENGAGE" Button**
**Location**: `src/components/ui/index.jsx:20-23`
- Sets `count = 3` and `countdown = true`
- Button hidden when `originalPhoto` exists or during `attract` state
- Button label changes from "engage" to countdown numbers

#### **3. Countdown → Photo Capture**
**Location**: `src/components/ui/index.jsx:25-41`
- Countdown managed by interval in UI component
- Counts 3 → 2 → 1 → 0
- When `count === 0`:
  - `setTakePhoto(true)`
  - `setCountdown(false)`

#### **4. Photo Capture → Upload**
**Locations**:
- `src/components/camera/index.jsx:60-77`
- `src/App.jsx:92-98`

Flow:
- Camera detects `takePhoto === true`
- Captures canvas as blob
- Sets `originalPhoto` (URL) and `originalPhotoBlob`
- `useEffect` in App.jsx detects `originalPhotoBlob` change
- Calls `uploadPhoto()`

#### **5. Upload → Loading → Results**
**Location**: `src/App.jsx:69-86`
- `setLoading(true)` - Shows loading overlay
- POST to backend `/submit` with photo + prompts
- On response:
  - `setLoading(false)`
  - `setPastPhoto()`, `setFuturePhoto()`, `setPhotoId()`
- Photos component automatically displays when these are set

#### **6. Display → Reset**
**Locations**:
- `src/App.jsx:100-107` - Auto-reset on attract
- `src/App.jsx:46-51` - Manual reset function
- `src/components/photos/index.jsx:71-76` - Reset button

Reset can be triggered:
- **Manually**: User clicks "Reset" button in photo grid
- **Automatically**: When `attract` becomes `true` (from idle timeout)
  - Clears all photos
  - Resets state
  - Cycle starts over

### **All Components Rendered Simultaneously**

**Location**: `src/App.jsx:137-177` - Everything is always mounted:
- `<Camera />` - Always visible (video preview, z-index: base)
- `<Photos />` - Visible when `originalPhoto` exists (4-quadrant grid)
- `<UI />` - Overlay with frame, UI elements, action button
  - Contains: Camcorder, TimeCurcuits, LedMatrix, FluxCapacitor, ActionButton
  - Hidden during `attract` state
- `<Loading />` - Visible when `loading === true`
- `<Attract />` - Visible when `attract === true`
- `<Idle />` - Visible when `idle === true`
- `<Leva />` - Control panel (F1 to toggle)

Each component controls its own visibility using CSS class `hidden` based on props.

### **Visual State Diagram**

```
ATTRACT STATE
    ↓ (user clicks anywhere)
CAMERA PREVIEW + UI OVERLAY (idle timers reset)
    ↓ (clicks "ENGAGE" button)
COUNTDOWN (3...2...1) - shown in button
    ↓ (count === 0)
PHOTO CAPTURE (canvas → blob)
    ↓ (blob ready)
LOADING (uploading to backend + AI processing)
    ↓ (response received)
4-QUADRANT PHOTO GRID + QR CODE + RESET BUTTON
    ↓ (click Reset OR 5min idle → 10s attract delay)
ATTRACT STATE (cycle repeats)
```

**Key insight**: It's a **state machine**, not route navigation. All components exist simultaneously and toggle visibility based on shared state in `App.jsx`.

---

## **Key Technical Aspects**

### **Architecture**
- **Frontend**: React 19 + Vite 7 + React Router
- **Backend**: Node.js server (separate repo) at `:8000` locally or Render.com in production
- **Styling**: SCSS with component-scoped styles using `@use` imports
- **State Management**: React hooks (no external state library)
- **Date Formatting**: `date-fns` library

### **UI Design System**

#### **Color Palette** (`src/index.scss`):
```scss
$red: #EF4123;
$yellow: #FFC300;
$orange: #FF8400;
$black: #000000;
$gray: #A3A2A2;
```

#### **Typography**:
- **Inter**: General UI
- **Orbitron**: Headers, QR code label
- **Digital**: Time circuit tickers (LED-style)

#### **Layout System**:
- Full viewport (`100vw × 100vh`)
- Absolute positioning with `inset: 0` for layers
- `pointer-events: none` on UI overlay (enabled on interactive elements)
- Z-index stacking: Camera (base) → Photos → UI → Overlays

### **Camera System**
**Location**: `src/components/camera/index.jsx`
- Uses `getUserMedia` for webcam access with `facingMode: "user"`
- Canvas-based frame capture via `requestAnimationFrame`
- Converts to blob for efficient upload (JPEG, 0.9 quality)
- Falls back to test video (`test.mp4`) when camera stopped
- Video starts at **random time** to avoid repetitive attract loop
- Manual camera toggle button (top-right)

### **DeLorean UI Components**

#### **Camcorder HUD** (`src/components/ui/camcorder/index.jsx`)
- Mimics 80s camcorder overlay
- Play/Rec indicators with icons
- Static timecode: "00: 00: 00: 00"
- Static date/time: "PM 04:20 July. 25. 1999"
- **TODO**: Make indicators "live" or respond to app state
- Hidden when `!active` (i.e., when photo taken)

#### **Time Circuits** (`src/components/ui/timecircuits/index.jsx`)
- 3 horizontal tickers (red/green/yellow)
- Positioned to resemble DeLorean dashboard
- **TODO**: Connect to actual date values
- Hidden when `!active`

#### **LED Matrix** (`src/components/ui/ledmatrix/index.jsx`)
- Static SVG background decoration
- Hidden when `!active`

#### **Flux Capacitor** (`src/components/ui/fluxcapacitor/index.jsx`)
- Static SVG background decoration
- Could be animated in future
- Hidden when `!active`

#### **Action Button** (`src/components/actionbutton/index.jsx`)
- Reusable button component with SVG background
- Props: `label`, `active`, `action`, `placement`
- Two instances:
  1. **"ENGAGE" button**: Bottom placement, triggers countdown
  2. **"Reset" button**: Right placement (in photo grid), resets app

#### **Ticker** (`src/components/ticker/index.jsx`)
- LED-style digital display with SVG background
- Shows formatted datetime: `format(datetime, "MMM dd yyyy HH mm")`
- Color variants: red, green, yellow
- Used in:
  - Time Circuits (3 static tickers in UI)
  - Photo grid (3 dynamic tickers showing past/present/future dates)
- **TODO**: Add ticker-style animation (random initial value → tween to target)

### **AI Prompts (Leva Controls)**
**Location**: `src/App.jsx:40-44, 113-125`
- Hidden control panel (toggle with **F1 key**)
- Configurable prompts:
  - `pastPrompt`: Style for past photo generation
  - `futurePrompt`: Style for future photo generation
  - `removePrompt`: Background removal instructions
- Prompts loaded from backend `/prompts` endpoint on mount
- Styled with custom Leva theme (larger fonts, wider panels)

### **Timeout Management**
**Location**: `src/App.jsx:31-32, 53-67`
- **Idle timeout**: **5 minutes** (300000ms) → shows "Are you Still There?"
- **Attract timeout**: +10s → resets to attract state
- Click anywhere resets timers via `addEventListener('click', resetIdleTimeout)`
- Uses `useRef` to store timeout IDs

### **Backend Integration**
**Location**: `src/App.jsx:33-35`
- **Environment detection**: Different URLs for local vs production
  - Local: `http://localhost:8000`
  - Production: `https://war-is-peace-photobooth-backend.onrender.com`
- **Endpoints**:
  - `POST /submit` - Upload photo + prompts (FormData)
  - `GET /prompts` - Fetch AI prompt defaults
  - `GET /photos/{photoId}.jpg` - Download generated photo

### **Mobile Sharing**
**Location**: `src/components/takeaway/index.jsx:13-33`
- Uses Web Share API for native share sheets
- Fetches photo as blob, converts to File object
- Falls back to opening image in new tab
- CORS configured with `crossOrigin="anonymous"`

### **Routing**
**Location**: `src/App.jsx:136-178`
- `/` - Main photobooth interface
- `/takeaway/:photoId` - Mobile download page
- Uses **HashRouter** for GitHub Pages compatibility
- Base path: `/war-is-peace-photobooth-frontend/`

### **Animation System**
Currently minimal - most transitions use CSS:
```scss
transition: opacity 1s, visibility 1s;
```

`.hidden` class:
```scss
visibility: hidden;
opacity: 0;
```

---

## **Component Breakdown**

### **Core Components**

| Component | Purpose | Key Props | State | Location |
|-----------|---------|-----------|-------|----------|
| `App.jsx` | Main orchestrator | - | All app state | Root |
| `Camera` | Video preview & capture | `takePhoto`, callbacks | `cameraStarted` | Full viewport layer |
| `Photos` | 4-quadrant photo grid + QR | `pastPhoto`, `originalPhoto`, `futurePhoto`, `photoId`, `reset` | - | Full viewport layer |
| `UI` | DeLorean-themed overlay + countdown | `countdown`, `setCountdown`, `setTakePhoto`, `originalPhoto`, `attract` | `count` | Overlay layer |
| `Camcorder` | 80s camcorder HUD | `active` | - | Inside UI |
| `TimeCurcuits` | 3 color tickers | `active` | - | Inside UI |
| `LedMatrix` | LED decoration | `active` | - | Inside UI |
| `FluxCapacitor` | Flux capacitor decoration | `active` | - | Inside UI |
| `ActionButton` | Stylized button (reusable) | `label`, `active`, `action`, `placement` | - | Inside UI + Photos |
| `Ticker` | Digital datetime display | `datetime`, `color` | - | Inside TimeCurcuits + Photos |
| `Loading` | AI processing indicator | `loading` | - | Overlay |
| `Idle` | Inactivity warning | `idle` | - | Overlay |
| `Attract` | Screensaver mode | `attract` | - | Overlay |
| `Takeaway` | Mobile download page | - | - | Separate route |

### **File Structure**
```
src/
├── App.jsx                                # Main state machine
├── main.jsx                               # React entry point
├── index.scss                             # Global styles, fonts, colors
├── assets/
│   ├── fonts/                             # Inter, Orbitron, Digital
│   ├── images/                            # SVG backgrounds, icons
│   └── videos/                            # test.mp4
├── components/
│   ├── camera/
│   │   ├── index.jsx                      # Webcam & canvas capture
│   │   └── index.scss
│   ├── photos/
│   │   ├── index.jsx                      # 4-quadrant grid + QR
│   │   └── index.scss
│   ├── ui/
│   │   ├── index.jsx                      # Main UI overlay + countdown
│   │   ├── index.scss
│   │   ├── camcorder/
│   │   │   ├── index.jsx                  # Camcorder HUD
│   │   │   └── index.scss
│   │   ├── timecircuits/
│   │   │   ├── index.jsx                  # 3 tickers
│   │   │   └── index.scss
│   │   ├── ledmatrix/
│   │   │   ├── index.jsx                  # LED decoration
│   │   │   └── index.scss
│   │   └── fluxcapacitor/
│   │       ├── index.jsx                  # Flux capacitor decoration
│   │       └── index.scss
│   ├── actionbutton/
│   │   ├── index.jsx                      # Reusable button
│   │   └── index.scss
│   ├── ticker/
│   │   ├── index.jsx                      # Digital datetime display
│   │   └── index.scss
│   ├── loading/
│   │   ├── index.jsx                      # Loading spinner
│   │   └── index.scss
│   ├── idle/
│   │   ├── index.jsx                      # Idle warning
│   │   └── index.scss
│   ├── attract/
│   │   ├── index.jsx                      # Attract screen
│   │   └── index.scss
│   └── takeaway/
│       ├── index.jsx                      # Mobile share page
│       └── index.scss
```

---

## **Animation Opportunities** 🎬

### **Current State**
- Minimal animations (CSS opacity/visibility transitions)
- Static UI elements (no motion)

### **Identified TODOs from Code**

1. **Ticker Animation** (`src/components/ticker/index.jsx:10-11`)
   - "a ticker style animation for the digits would look nice here"
   - Suggested approach: Set random initial value, tween to target datetime
   - Could use a rolling number effect like slot machine

2. **Camcorder Live Data** (`src/components/ui/camcorder/index.jsx:9`)
   - "make all these 'live' or at least respond to app state"
   - Rec indicator could blink during countdown
   - Timecode could count up during photo session
   - Date/time could show actual current time

3. **Photo Grid Countdown** (`src/components/photos/index.jsx:1-2`)
   - "add some sort of visual countdown around the QR code"
   - Let users know booth will reset in X seconds
   - Could be circular progress bar or timer

### **Suggested Animation Enhancements**

#### **High Priority**
- **Flux Capacitor Pulse**: Animate SVG to pulse/glow during countdown
- **Ticker Roll-in**: Digits roll like odometer when photos appear
- **Button Hover States**: Scale/glow effects on "ENGAGE" and "Reset"
- **Photo Grid Entrance**: Stagger animation when quadrants appear
- **QR Code Pulse**: Subtle pulse to draw attention

#### **Medium Priority**
- **LED Matrix Scan**: Horizontal scan line effect
- **Camcorder Rec Blink**: Red dot blinks during active states
- **Loading Spinner**: Custom DeLorean-themed loader
- **Attract Loop**: Animated text or video showcase
- **Idle Warning**: Bounce or fade animation

#### **Low Priority**
- **Time Circuit Flicker**: Occasional glitch effect
- **Camera Frame Glitch**: VHS-style scan lines
- **Background Particles**: Subtle floating elements
- **Sound Effects**: Shutter click, countdown beep, etc.

---

## **Notable TODOs from Code**
- ✅ ~~Countdown moved into UI component~~ (completed in recent commits)
- 🔲 Add ticker-style animation for digits (`ticker/index.jsx:10-11`)
- 🔲 Make camcorder indicators "live" (`ui/camcorder/index.jsx:9`)
- 🔲 Add visual countdown on photo grid (`photos/index.jsx:1-2`)
- 🔲 Connect Time Circuits to actual date values

---

## **Development Setup**

### **Requirements**
- Node.js 20.19+ or 22.12+
- Backend server running on port 8000 (separate repo)

### **Run Locally**
```bash
npm install
npm start  # Runs on port 8080
```

### **Configuration**
- Vite config: `vite.config.js`
- Base path: `/war-is-peace-photobooth-frontend/` (for GitHub Pages)
- Dev server: `localhost:8080`

### **Keyboard Shortcuts**
- **F1**: Toggle Leva control panel (AI prompt configuration)

---

## **Recent Changes** (from git history)
- `660b623` - Fix paths
- `b086090` - Fixing paths
- `c6a1593` - Updates
- `a9c7824` - **Randomize video start** (avoid repetitive attract loop)
- `8582484` - Import styles
- `4295143` - More UI elements
- `8341cd7` - **Move countdown into UI** (consolidated from separate component)
- `9f87291` - Reset
- `400ce2b` - Photos view and tickers
- `2a66cf8` - Styling

---

This is a **highly themed kiosk-style app** with a cohesive DeLorean/Back to the Future aesthetic. The UI is feature-rich but currently static - significant animation opportunities exist to bring the time-travel theme to life. The app demonstrates strong separation of concerns with component modularity and a clear state machine architecture.
