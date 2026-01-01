import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const GestureControl = ({ isActive, onToggle }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // State for gesture detection
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const smoothedPositionRef = useRef({ x: null, y: null });
  const rightClickStateRef = useRef(false);
  const leftClickStateRef = useRef(false);

  // Constants (matching your notebook)
  // Note: Dead zone is in screen pixels, thresholds are in video pixels
  const deadZone = 5; // Reduced for screen coordinates
  const alpha = 0.2; // EMA smoothing factor
  const pinchThreshold = 50; // Video pixel distance for pinch
  const clickThreshold = 40; // Video pixel distance for clicks
  const leftClickThreshold = 50; // Video pixel distance for left click
  const sensitivity = 1.0; // Can adjust if needed

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
          
          // Convert normalized coordinates to screen pixels
          // Apply sensitivity if needed (optional scaling)
          const screenX = flippedX * screenWidth * sensitivity;
          const screenY = indexTip.y * screenHeight * sensitivity;

          // Clamp to screen bounds
          const clampedX = Math.max(0, Math.min(screenWidth, screenX));
          const clampedY = Math.max(0, Math.min(screenHeight, screenY));

          // Apply EMA smoothing
          if (smoothedPositionRef.current.x === null) {
            smoothedPositionRef.current.x = clampedX;
            smoothedPositionRef.current.y = clampedY;
          } else {
            smoothedPositionRef.current.x = alpha * clampedX + (1 - alpha) * smoothedPositionRef.current.x;
            smoothedPositionRef.current.y = alpha * clampedY + (1 - alpha) * smoothedPositionRef.current.y;
          }

          // Apply dead zone (in screen pixels)
          const deltaX = Math.abs(smoothedPositionRef.current.x - prevPositionRef.current.x);
          const deltaY = Math.abs(smoothedPositionRef.current.y - prevPositionRef.current.y);

          if (deltaX > deadZone || deltaY > deadZone || prevPositionRef.current.x === 0) {
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

        // Handle clicks - use current smoothed position for accuracy
        const currentCursorX = smoothedPositionRef.current.x !== null ? smoothedPositionRef.current.x : cursorPosition.x;
        const currentCursorY = smoothedPositionRef.current.y !== null ? smoothedPositionRef.current.y : cursorPosition.y;

        if (rightClickEngaged && !rightClickStateRef.current) {
          // Right click - trigger context menu or custom action
          const element = document.elementFromPoint(currentCursorX, currentCursorY);
          if (element) {
            const event = new MouseEvent('contextmenu', {
              bubbles: true,
              cancelable: true,
              view: window,
              button: 2,
              clientX: currentCursorX,
              clientY: currentCursorY,
            });
            element.dispatchEvent(event);
          }
          rightClickStateRef.current = true;
        } else if (!rightClickEngaged) {
          rightClickStateRef.current = false;
        }

        if (leftClickEngaged && !leftClickStateRef.current) {
          // Left click - trigger click event
          const element = document.elementFromPoint(currentCursorX, currentCursorY);
          if (element) {
            const event = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
              button: 0,
              clientX: currentCursorX,
              clientY: currentCursorY,
            });
            element.dispatchEvent(event);
          }
          leftClickStateRef.current = true;
        } else if (!leftClickEngaged) {
          leftClickStateRef.current = false;
        }
      }
    } else {
      setIsVisible(false);
    }

    canvasCtx.restore();
  }, [cursorPosition]);

  useEffect(() => {
    if (!isActive) {
      // Reset states when stopping
      smoothedPositionRef.current = { x: null, y: null };
      prevPositionRef.current = { x: 0, y: 0 };
      setIsVisible(false);
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      return;
    }

    if (!videoRef.current) {
      console.error('Video element not available');
      return;
    }

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7, // Slightly lowered for better detection
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start().catch((error) => {
      console.error('Camera start error:', error);
    });

    handsRef.current = hands;
    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
  }, [isActive, onResults]);

  return (
    <>
      {/* Video and Canvas (hidden but accessible) */}
      {isActive && (
        <div className="fixed top-0 left-0 w-1 h-1 overflow-hidden pointer-events-none opacity-0">
          <video
            ref={videoRef}
            className="transform scale-x-[-1]"
            autoPlay
            playsInline
            muted
            style={{ 
              width: '1px',
              height: '1px',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
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
