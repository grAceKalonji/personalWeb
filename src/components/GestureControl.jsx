import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const GestureControl = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // State for gesture detection
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const smoothedPositionRef = useRef({ x: null, y: null });
  const rightClickStateRef = useRef(false);
  const leftClickStateRef = useRef(false);

  // Constants (matching your notebook)
  const deadZone = 20;
  const alpha = 0.2; // EMA smoothing factor
  const pinchThreshold = 50;
  const clickThreshold = 40;
  const leftClickThreshold = 50;
  const sensitivity = 1.4;

  const onResults = useCallback((results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    const video = videoRef.current;
    
    if (!canvasCtx || !video) return;

    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const handLandmarks of results.multiHandLandmarks) {
        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // MediaPipe Hands landmark indices
        const INDEX_FINGER_TIP = 8;
        const THUMB_TIP = 4;
        const MIDDLE_FINGER_TIP = 12;
        const RING_FINGER_TIP = 16;

        // Get landmark positions (normalized 0-1)
        const indexTip = handLandmarks[INDEX_FINGER_TIP];
        const thumbTip = handLandmarks[THUMB_TIP];
        const middleTip = handLandmarks[MIDDLE_FINGER_TIP];
        const ringTip = handLandmarks[RING_FINGER_TIP];

        // Convert to pixel coordinates in video space (for distance calculations)
        const indexX = indexTip.x * videoWidth;
        const indexY = indexTip.y * videoHeight;
        const thumbX = thumbTip.x * videoWidth;
        const thumbY = thumbTip.y * videoHeight;
        const middleX = middleTip.x * videoWidth;
        const middleY = middleTip.y * videoHeight;
        const ringX = ringTip.x * videoWidth;
        const ringY = ringTip.y * videoHeight;

        // Calculate distances
        const pinchDistance = Math.hypot(indexX - thumbX, indexY - thumbY);
        const rightClickDistance = Math.hypot(middleX - indexX, middleY - indexY);
        const leftClickDistance = Math.hypot(ringX - thumbX, ringY - thumbY);

        // Check gestures
        const cursorControl = pinchDistance < pinchThreshold;
        const rightClickEngaged = rightClickDistance < clickThreshold;
        const leftClickEngaged = leftClickDistance < leftClickThreshold;

        if (cursorControl) {
          // Map normalized coordinates (0-1) to screen coordinates
          // Flip horizontally for mirror effect (like your notebook)
          const flippedX = 1 - indexTip.x;
          const screenX = flippedX * screenWidth;
          const screenY = indexTip.y * screenHeight;

          // Apply EMA smoothing
          if (smoothedPositionRef.current.x === null) {
            smoothedPositionRef.current.x = screenX;
            smoothedPositionRef.current.y = screenY;
          } else {
            smoothedPositionRef.current.x = alpha * screenX + (1 - alpha) * smoothedPositionRef.current.x;
            smoothedPositionRef.current.y = alpha * screenY + (1 - alpha) * smoothedPositionRef.current.y;
          }

          // Apply dead zone
          const deltaX = Math.abs(smoothedPositionRef.current.x - prevPositionRef.current.x);
          const deltaY = Math.abs(smoothedPositionRef.current.y - prevPositionRef.current.y);

          if (deltaX > deadZone || deltaY > deadZone) {
            setCursorPosition({
              x: smoothedPositionRef.current.x,
              y: smoothedPositionRef.current.y,
            });
            setIsVisible(true);
            prevPositionRef.current = {
              x: smoothedPositionRef.current.x,
              y: smoothedPositionRef.current.y,
            };
          }
        } else {
          setIsVisible(false);
        }

        // Handle clicks
        if (rightClickEngaged && !rightClickStateRef.current) {
          // Right click - trigger context menu or custom action
          const element = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
          if (element) {
            const event = new MouseEvent('contextmenu', {
              bubbles: true,
              cancelable: true,
              view: window,
              button: 2,
            });
            element.dispatchEvent(event);
          }
          rightClickStateRef.current = true;
        } else if (!rightClickEngaged) {
          rightClickStateRef.current = false;
        }

        if (leftClickEngaged && !leftClickStateRef.current) {
          // Left click - trigger click event
          const element = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
          if (element) {
            const event = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
              button: 0,
            });
            element.dispatchEvent(event);
          }
          leftClickStateRef.current = true;
        } else if (!leftClickEngaged) {
          leftClickStateRef.current = false;
        }

        // Draw hand landmarks (optional, for debugging)
        // You can uncomment this to see hand tracking visualization
        /*
        for (const landmark of handLandmarks) {
          const x = landmark.x * canvasRef.current.width;
          const y = landmark.y * canvasRef.current.height;
          canvasCtx.fillStyle = '#00FF00';
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
          canvasCtx.fill();
        }
        */
      }
    } else {
      setIsVisible(false);
    }

    canvasCtx.restore();
  }, [cursorPosition]);

  useEffect(() => {
    if (!isActive) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    handsRef.current = hands;
    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [isActive, onResults]);

  const toggleGestureControl = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Reset states when starting
      smoothedPositionRef.current = { x: null, y: null };
      prevPositionRef.current = { x: 0, y: 0 };
      setIsVisible(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleGestureControl}
        className={`
          fixed
          top-8
          right-8
          z-[100]
          px-4
          py-2
          rounded-xl
          border
          border-apple-gray-200
          bg-white
          shadow-lg
          transition-all
          duration-300
          hover:shadow-xl
          hover:scale-105
          ${isActive ? 'bg-apple-gray-900 text-white border-apple-gray-900' : 'text-apple-gray-900'}
        `}
        aria-label={isActive ? 'Disable gesture control' : 'Enable gesture control'}
      >
        <span className="text-sm font-medium">
          {isActive ? '🖐️ Stop Gestures' : '👋 Start Gestures'}
        </span>
      </button>

      {/* Video and Canvas (hidden) */}
      {isActive && (
        <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            className="transform scale-x-[-1]"
            autoPlay
            playsInline
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Virtual Cursor */}
      {isActive && isVisible && (
        <div
          className="fixed pointer-events-none z-[99] transition-all duration-100 ease-out"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-6 h-6 rounded-full bg-blue-500/80 border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestureControl;

