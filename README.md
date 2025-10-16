# Hand Gesture Control Interface

A real-time hand gesture control system built with React, TensorFlow.js, and Convex, allowing users to control their cursor and scroll through web pages using hand gestures captured through their webcam.

![Gesture Control Demo](public/og-preview.jpg)

## Features

### 🖱️ Cursor Control Mode
- **Cursor Movement**: Control cursor position with your index finger
- **Click Action**: Quick forward motion with index finger triggers a click
- **Visual Feedback**: Dynamic cursor color changes based on gesture type
- **Real-time Tracking**: Smooth cursor following with gesture detection

### 📜 Scroll Mode
- **Mode Switching**: Show full hand (5 fingers) to toggle between cursor and scroll modes
- **Scroll Action**: Three-finger grab gesture to scroll up/down
- **Visual Indicators**: Pulsing cursor effect in scroll mode

### 🔄 Interactive Features
- Real-time gesture recognition
- Mode switching with visual feedback
- Toast notifications for actions
- Gesture history logging
- Interactive UI elements for testing

## Technology Stack

- **Frontend**: React + Vite
- **Styling**: TailwindCSS
- **Hand Detection**: TensorFlow.js + MediaPipe Hands
- **Backend & Real-time Updates**: Convex
- **Authentication**: Convex Auth
- **Notifications**: Sonner


## Gesture Guide

| Gesture | Action | Mode |
|---------|--------|------|
| ☝️ Index Finger Up | Move Cursor | Cursor Mode |
| 🫰 Quick Forward Motion | Click | Cursor Mode |
| 🖐️ Full Hand | Switch Modes | Both |
| ✌️ Three-Finger Grab | Scroll | Scroll Mode |

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn
- Webcam
- Modern browser (Chrome recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gesture-control-interface
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Usage

1. Sign in using the authentication form
2. Allow camera access when prompted
3. Use the gestures described in the Gesture Guide above
4. View your gesture history in the Recent Gestures section

## Technical Implementation

### Hand Detection
The system uses TensorFlow.js and MediaPipe Hands for real-time hand pose detection, tracking 21 3D landmarks on each hand.

### Gesture Recognition
- **Pointing**: Detected when index finger is raised above its base while other fingers are lowered
- **Clicking**: Triggered by rapid forward motion while pointing
- **Mode Switch**: Detected when all five fingers are extended
- **Scrolling**: Activated when three fingers are raised in scroll mode

### State Management
- Real-time gesture state managed with React hooks
- Persistent gesture history stored in Convex backend
- Authentication state handled by Convex Auth

## Performance Considerations

- Gesture detection runs in a requestAnimationFrame loop for smooth performance
- Debounced click detection prevents accidental triggers
- Optimized coordinate mapping for accurate cursor positioning
- Efficient real-time updates using Convex's reactive backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js team for the hand pose detection model
- MediaPipe team for the hand tracking solution
- Convex team for the real-time backend platform

## Future Enhancements

- Additional gesture controls
- Customizable gesture mappings
- Support for two-handed gestures
- Gesture recording and playback
- Accessibility improvements
