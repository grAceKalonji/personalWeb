import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const GestureControl = ({ isActive, onToggle, videoContainerElement = null }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showDebugWindow, setShowDebugWindow] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    pinchDistance: 0,
    rightClickDistance: 0,
    leftClickDistance: 0,
    cursorControl: false,
    rightClickEngaged: false,
    leftClickEngaged: false,
    handDetected: false,
  });

  // State for gesture detection
  const prevPositionRef = useRef({ x: 0, y: 0 });
  const smoothedPositionRef = useRef({ x: null, y: null });
  const rightClickStateRef = useRef(false);
  const leftClickStateRef = useRef(false);
  const handLostTimeoutRef = useRef(null);
  const lastHandDetectedRef = useRef(false);

  // Constants (matching your notebook)
  // Note: Dead zone is in screen pixels, thresholds are in video pixels
  const deadZone = 5; // Reduced for screen coordinates
  const alpha = 0.2; // EMA smoothing factor
  const pinchThreshold = 50; // Video pixel distance for pinch
  const clickThreshold = 40; // Video pixel distance for clicks
  const leftClickThreshold = 50; // Video pixel distance for left click
  const sensitivity = 1.0; // Can adjust if needed

  // Helper function to draw hand connections
  const drawConnections = (ctx, landmarks, width, height) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [5, 9], [9, 10], [10, 11], [11, 12], // Middle
      [9, 13], [13, 14], [14, 15], [15, 16], // Ring
      [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [0, 17], // Wrist to pinky base
    ];

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (const [start, end] of connections) {
      const startX = landmarks[start].x * width;
      const startY = landmarks[start].y * height;
      const endX = landmarks[end].x * width;
      const endY = landmarks[end].y * height;
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();
  };

  const onResults = useCallback((results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    const video = videoRef.current;
    
    if (!canvasCtx || !video) return;

    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Clear any existing timeout when hand is detected
    if (handLostTimeoutRef.current) {
      clearTimeout(handLostTimeoutRef.current);
      handLostTimeoutRef.current = null;
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      lastHandDetectedRef.current = true;
      
      // Draw hand landmarks and connections for debugging
      if (showDebugWindow) {
        for (const handLandmarks of results.multiHandLandmarks) {
          // Draw connections
          drawConnections(canvasCtx, handLandmarks, results.image.width, results.image.height);
          
          // Draw landmarks
          for (const landmark of handLandmarks) {
            const x = landmark.x * results.image.width;
            const y = landmark.y * results.image.height;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
            canvasCtx.fillStyle = '#00FF00';
            canvasCtx.fill();
          }
        }
      }
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

        // Update debug info
        setDebugInfo({
          pinchDistance: Math.round(pinchDistance),
          rightClickDistance: Math.round(rightClickDistance),
          leftClickDistance: Math.round(leftClickDistance),
          cursorControl,
          rightClickEngaged,
          leftClickEngaged,
          handDetected: true,
        });

        // Draw visual indicators on canvas for debugging
        if (showDebugWindow) {
          // Draw pinch distance line
          canvasCtx.strokeStyle = cursorControl ? '#FF0000' : '#FFFF00';
          canvasCtx.lineWidth = 2;
          canvasCtx.beginPath();
          canvasCtx.moveTo(indexX, indexY);
          canvasCtx.lineTo(thumbX, thumbY);
          canvasCtx.stroke();
          
          // Draw right click distance line
          canvasCtx.strokeStyle = rightClickEngaged ? '#FF0000' : '#00FFFF';
          canvasCtx.beginPath();
          canvasCtx.moveTo(middleX, middleY);
          canvasCtx.lineTo(indexX, indexY);
          canvasCtx.stroke();
          
          // Draw left click distance line
          canvasCtx.strokeStyle = leftClickEngaged ? '#FF0000' : '#FF00FF';
          canvasCtx.beginPath();
          canvasCtx.moveTo(ringX, ringY);
          canvasCtx.lineTo(thumbX, thumbY);
          canvasCtx.stroke();
          
          // Draw threshold circles
          canvasCtx.strokeStyle = '#FFFFFF';
          canvasCtx.lineWidth = 1;
          canvasCtx.setLineDash([5, 5]);
          canvasCtx.beginPath();
          canvasCtx.arc(thumbX, thumbY, pinchThreshold, 0, 2 * Math.PI);
          canvasCtx.stroke();
          
          canvasCtx.beginPath();
          canvasCtx.arc(indexX, indexY, clickThreshold, 0, 2 * Math.PI);
          canvasCtx.stroke();
          
          canvasCtx.beginPath();
          canvasCtx.arc(thumbX, thumbY, leftClickThreshold, 0, 2 * Math.PI);
          canvasCtx.stroke();
          
          canvasCtx.setLineDash([]);
        }

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
      // Hand not detected - use timeout to prevent flickering
      if (lastHandDetectedRef.current) {
        // Only set timeout if we previously had a hand detected
        // Keep cursor visible during grace period
        if (!handLostTimeoutRef.current) {
          handLostTimeoutRef.current = setTimeout(() => {
            // After 300ms of no hand, disengage
            setIsVisible(false);
            setDebugInfo(prev => ({
              ...prev,
              handDetected: false,
              cursorControl: false,
              rightClickEngaged: false,
              leftClickEngaged: false,
            }));
            lastHandDetectedRef.current = false;
            handLostTimeoutRef.current = null;
            // Reset smoothed position when hand is truly lost
            smoothedPositionRef.current = { x: null, y: null };
          }, 300); // 300ms grace period to prevent flickering
        }
        // Update debug info but keep handDetected as true during grace period
        setDebugInfo(prev => ({
          ...prev,
          handDetected: true, // Keep as true during grace period
        }));
      } else {
        // No hand was detected and we didn't have one before
        setDebugInfo(prev => ({
          ...prev,
          handDetected: false,
          cursorControl: false,
          rightClickEngaged: false,
          leftClickEngaged: false,
        }));
      }
    }

    canvasCtx.restore();
  }, [showDebugWindow]);

  useEffect(() => {
    if (!isActive) {
      // Reset states when stopping
      smoothedPositionRef.current = { x: null, y: null };
      prevPositionRef.current = { x: 0, y: 0 };
      setIsVisible(false);
      lastHandDetectedRef.current = false;
      if (handLostTimeoutRef.current) {
        clearTimeout(handLostTimeoutRef.current);
        handLostTimeoutRef.current = null;
      }
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
      minDetectionConfidence: 0.5, // Lowered for better initial detection
      minTrackingConfidence: 0.7, // Increased for more stable tracking once detected
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
      if (handLostTimeoutRef.current) {
        clearTimeout(handLostTimeoutRef.current);
        handLostTimeoutRef.current = null;
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
  }, [isActive, onResults]);

  return (
    <>
      {/* Debug Toggle Button */}
      {isActive && (
        <button
          onClick={() => setShowDebugWindow(!showDebugWindow)}
          className="fixed top-4 right-4 z-[250] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg font-semibold transition-colors"
          title="Toggle Debug Window"
        >
          {showDebugWindow ? 'Hide Debug' : 'Show Debug'}
        </button>
      )}

      {/* Video and Canvas - Render in custom location via portal if provided */}
      {isActive && videoContainerElement && createPortal(
        <div className={`w-full h-full relative bg-black rounded-xl overflow-hidden ${showDebugWindow ? '' : 'opacity-0 pointer-events-none'}`}>
          <video
            ref={videoRef}
            className="transform scale-x-[-1] w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-full transform scale-x-[-1] pointer-events-none"
          />
        </div>,
        videoContainerElement
      )}
      
      {/* Default fixed position video display */}
      {isActive && !videoContainerElement && (
        <div className={showDebugWindow ? "fixed top-20 right-4 z-[250] bg-black rounded-lg shadow-2xl p-2 relative" : "fixed top-0 left-0 w-1 h-1 overflow-hidden pointer-events-none opacity-0"}>
          <video
            ref={videoRef}
            className={showDebugWindow ? "transform scale-x-[-1] rounded block" : "transform scale-x-[-1]"}
            autoPlay
            playsInline
            muted
            style={showDebugWindow ? { 
              width: '320px',
              height: '240px',
            } : { 
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
            className={showDebugWindow ? "absolute top-2 left-2 transform scale-x-[-1]" : ""}
            style={showDebugWindow ? {
              width: '320px',
              height: '240px',
              pointerEvents: 'none',
            } : { display: 'none' }}
          />
        </div>
      )}

      {/* Debug Info Panel */}
      {/* {isActive && showDebugWindow && (
        <div className="fixed top-20 right-[360px] z-[250] bg-gray-900 text-white p-4 rounded-lg shadow-2xl font-mono text-sm min-w-[250px]">
          <h3 className="text-lg font-bold mb-3 text-blue-400">Debug Info</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Hand Detected:</span>{' '}
              <span className={debugInfo.handDetected ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.handDetected ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Pinch Distance:</span>{' '}
              <span className={debugInfo.cursorControl ? 'text-green-400' : 'text-yellow-400'}>
                {debugInfo.pinchDistance}px
              </span>
              <span className="text-gray-500 text-xs ml-2">(threshold: {pinchThreshold}px)</span>
            </div>
            <div>
              <span className="text-gray-400">Cursor Control:</span>{' '}
              <span className={debugInfo.cursorControl ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.cursorControl ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Right Click Distance:</span>{' '}
              <span className={debugInfo.rightClickEngaged ? 'text-green-400' : 'text-cyan-400'}>
                {debugInfo.rightClickDistance}px
              </span>
              <span className="text-gray-500 text-xs ml-2">(threshold: {clickThreshold}px)</span>
            </div>
            <div>
              <span className="text-gray-400">Right Click:</span>{' '}
              <span className={debugInfo.rightClickEngaged ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.rightClickEngaged ? 'Engaged' : 'Not Engaged'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Left Click Distance:</span>{' '}
              <span className={debugInfo.leftClickEngaged ? 'text-green-400' : 'text-pink-400'}>
                {debugInfo.leftClickDistance}px
              </span>
              <span className="text-gray-500 text-xs ml-2">(threshold: {leftClickThreshold}px)</span>
            </div>
            <div>
              <span className="text-gray-400">Left Click:</span>{' '}
              <span className={debugInfo.leftClickEngaged ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.leftClickEngaged ? 'Engaged' : 'Not Engaged'}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-700">
              <div>
                <span className="text-gray-400">Cursor Position:</span>{' '}
                <span className="text-white">
                  ({Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)})
                </span>
              </div>
              <div>
                <span className="text-gray-400">Cursor Visible:</span>{' '}
                <span className={isVisible ? 'text-green-400' : 'text-red-400'}>
                  {isVisible ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Virtual Cursor */}
      {isActive && isVisible && (
        <div
          className="fixed pointer-events-none z-[250] transition-all duration-100 ease-out"
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
