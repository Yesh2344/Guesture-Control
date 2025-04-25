import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';

export function GestureDetector() {
  const webcamRef = useRef<Webcam>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointing, setIsPointing] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [gestureMode, setGestureMode] = useState<'cursor' | 'scroll'>('cursor');
  const logGesture = useMutation(api.gestures.logGesture);
  const lastClick = useRef<number>(0);
  const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let detector: handPoseDetection.HandDetector;
    
    async function setupDetector() {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full'
      } as const;
      detector = await handPoseDetection.createDetector(model, detectorConfig);
      
      requestAnimationFrame(detect);
    }

    async function detect() {
      if (!webcamRef.current || !cursorRef.current) return;
      
      const video = webcamRef.current.video;
      if (!video || !detector) return;

      try {
        const hands = await detector.estimateHands(video);
        if (hands.length > 0) {
          const hand = hands[0];
          const indexFinger = hand.keypoints[8]; // Index fingertip
          const thumbTip = hand.keypoints[4]; // Thumb tip
          const middleFinger = hand.keypoints[12]; // Middle fingertip
          const ringFinger = hand.keypoints[16]; // Ring fingertip
          const pinkyTip = hand.keypoints[20]; // Pinky tip
          const indexBase = hand.keypoints[5]; // Index finger base
          
          // Check various gestures
          const isPointing = indexFinger.y < indexBase.y && middleFinger.y > indexBase.y;
          const isGrabbing = 
            thumbTip.y < indexBase.y && 
            indexFinger.y < indexBase.y && 
            middleFinger.y < indexBase.y && 
            ringFinger.y > indexBase.y && 
            pinkyTip.y > indexBase.y;
          const isFullHand = 
            thumbTip.y < indexBase.y && 
            indexFinger.y < indexBase.y && 
            middleFinger.y < indexBase.y && 
            ringFinger.y < indexBase.y && 
            pinkyTip.y < indexBase.y;

          setIsPointing(isPointing);
          setIsGrabbing(isGrabbing);

          // Convert coordinates to screen space
          const x = (1 - indexFinger.x / video.width) * window.innerWidth;
          const y = (indexFinger.y / video.height) * window.innerHeight;

          // Handle different gestures
          if (isFullHand) {
            // Switch modes between cursor and scroll
            const now = Date.now();
            if (now - lastClick.current > 1000) {
              lastClick.current = now;
              const newMode = gestureMode === 'cursor' ? 'scroll' : 'cursor';
              setGestureMode(newMode);
              toast.success(`Switched to ${newMode} mode`);
              await logGesture({
                gesture: "mode_switch",
                action: `switched_to_${newMode}_mode`
              });
            }
          } else if (isGrabbing && gestureMode === 'scroll') {
            // Scroll mode
            const dy = y - lastPosition.current.y;
            window.scrollBy(0, dy);
            await logGesture({
              gesture: "scroll",
              action: `scrolled_${dy > 0 ? 'down' : 'up'}`
            });
          } else if (isPointing) {
            // Cursor mode - check for click
            const dx = x - lastPosition.current.x;
            const dy = y - lastPosition.current.y;
            const speed = Math.sqrt(dx * dx + dy * dy);
            
            if (speed > 50) {
              const now = Date.now();
              if (now - lastClick.current > 500) {
                lastClick.current = now;
                const element = document.elementFromPoint(x, y) as HTMLElement;
                if (element?.click) {
                  element.click();
                  toast.success('Click!');
                  await logGesture({
                    gesture: "click",
                    action: `clicked_at_${Math.round(x)},${Math.round(y)}`
                  });
                }
              }
            }
          }

          // Update cursor position
          cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
          lastPosition.current = { x, y };
        }
      } catch (error) {
        console.error("Error detecting hands:", error);
      }

      requestAnimationFrame(detect);
    }

    setupDetector();
  }, [logGesture, gestureMode]);

  return (
    <div className="relative">
      <Webcam
        ref={webcamRef}
        className="rounded-lg shadow-lg"
        mirrored
        width={640}
        height={480}
      />
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-6 h-6 pointer-events-none transition-transform duration-75 z-50 
          ${isPointing ? 'opacity-100' : 'opacity-50'}
          ${gestureMode === 'scroll' ? 'animate-pulse' : ''}`}
        style={{
          background: isGrabbing ? '#ef4444' : isPointing ? '#4f46e5' : '#94a3b8',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      />
      <div className="mt-4 space-y-2 text-center text-slate-600">
        <p>Current mode: <span className="font-semibold">{gestureMode}</span></p>
        <p>🤚 Show full hand to switch modes</p>
        <p>👆 Point with index finger to move cursor</p>
        <p>🫰 Quick forward motion to click</p>
        <p>✌️ Grab with three fingers to scroll (in scroll mode)</p>
      </div>
    </div>
  );
}
