import React, { useEffect, useRef, useState } from "react";
import {
  setupFaceLandmarker,
  startCamera,
  stopCamera,
  detectFace,
  detectExpression,
} from "../utils/util";

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceExpression() {
  const videoRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  const faceLandmarkerRef = useRef(null);
  const blendshapeRef = useRef(null);

  useEffect(() => {
    setupFaceLandmarker(faceLandmarkerRef);

    return () => {
      stopCamera(videoRef);
    };
  }, []);

  //   // =========================
  //   // SETUP MEDIAPIPE
  //   // =========================
  //   const setupFaceLandmarker = async () => {
  //     // Load MediaPipe Vision files
  //     const vision = await FilesetResolver.forVisionTasks(
  //       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
  //     );

  //     // Create FaceLandmarker
  //     const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
  //       baseOptions: {
  //         modelAssetPath:
  //           "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  //       },

  //       runningMode: "VIDEO",

  //       outputFaceBlendshapes: true,
  //       outputFacialTransformationMatrixes: true,

  //       numFaces: 1,
  //     });

  //     faceLandmarkerRef.current = faceLandmarker;

  //     // startCamera();
  //   };

  //   // =========================
  //   // START CAMERA
  //   // =========================
  //   const startCamera = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: true,
  //       });

  //       const video = videoRef.current;

  //       video.srcObject = stream;

  //       await video.play();

  //       detectFace();
  //     } catch (error) {
  //       console.log(error);

  //       setExpression("Camera Error");
  //     }
  //   };

  //   // =========================
  //   // STOP CAMERA
  //   // =========================
  //   const stopCamera = () => {
  //     const video = videoRef.current;

  //     if (video && video.srcObject) {
  //       const tracks = video.srcObject.getTracks();

  //       tracks.forEach((track) => track.stop());
  //     }
  //   };

  //   // =========================
  //   // FACE DETECTION LOOP
  //   // =========================
  //   const detectFace = async () => {
  //     const video = videoRef.current;

  //     const faceLandmarker = faceLandmarkerRef.current;

  //     // Wait until video is ready
  //     if (!video || !faceLandmarker || video.readyState < 2) {
  //       requestAnimationFrame(detectFace);
  //       return;
  //     }

  //     const results = faceLandmarker.detectForVideo(video, performance.now());

  //     // Face detected
  //     if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
  //       const blendshapes = results.faceBlendshapes[0].categories;

  //       blendshapeRef.current = blendshapes; //detectExpression(blendshapes);
  //     } else {
  //       setExpression("No Face Detected");
  //     }

  //     requestAnimationFrame(detectFace);
  //   };

  //   // =========================
  //   // EXPRESSION DETECTION
  //   // =========================
  //   const detectExpression = (blendshapes) => {
  //     const getScore = (name) => {
  //       return (
  //         blendshapes.find((shape) => shape.categoryName === name)?.score || 0
  //       );
  //     };

  //     // Smile
  //     const smile = getScore("mouthSmileLeft") + getScore("mouthSmileRight");

  //     // Mouth Open
  //     const jawOpen = getScore("jawOpen");

  //     // Angry
  //     const browDown = getScore("browDownLeft") + getScore("browDownRight");

  //     // Surprise
  //     const surprise =
  //       jawOpen + getScore("eyeWideLeft") + getScore("eyeWideRight");

  //     // =====================
  //     // LOGIC
  //     // =====================

  //     if (smile > 0.7) {
  //       setExpression("😊 Happy");
  //     } else if (surprise > 1.2) {
  //       setExpression("😲 Surprised");
  //     } else if (browDown > 0.8) {
  //       setExpression("😠 Angry");
  //     } else {
  //       setExpression("😐 Neutral");
  //     }
  //   };

  const handleDetectExpression = () => {
    if (!blendshapeRef.current) {
      setExpression("No Face Detected");
      return;
    }

    const result = detectExpression(blendshapeRef.current);

    setExpression(result);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h1 className="text-3xl underline mb-2">Face Expression Detection</h1>

      <button
        className="px-4 py-2 bg-red-800 text-white text-xl m-2 rounded active:scale-95 cursor-pointer"
        onClick={() =>
          startCamera(
            videoRef,
            () =>
              detectFace(
                videoRef,
                faceLandmarkerRef,
                blendshapeRef,
                setExpression,
              ),
            setExpression,
          )
        }
      >
        Enable Camera
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="300"
        height="250"
        style={{
          borderRadius: "20px",
          border: "4px solid black",
          objectFit: "cover",
        }}
      />

      <h2 className="text-2xl mt-2">{expression}</h2>

      <button
        onClick={handleDetectExpression}
        className="px-4 py-2 bg-emerald-500 text-white mt-2 rounded active:scale-95 cursor-pointer text-xl font-semibold"
      >
        Detect Expression
      </button>
    </div>
  );
}
