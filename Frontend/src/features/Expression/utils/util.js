import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// =========================
// SETUP MEDIAPIPE
// =========================
export const setupFaceLandmarker = async (faceLandmarkerRef) => {
  // Load MediaPipe Vision files
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
  );

  // Create FaceLandmarker
  const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },

    runningMode: "VIDEO",

    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true,

    numFaces: 1,
  });

  faceLandmarkerRef.current = faceLandmarker;

  // startCamera();
};

// =========================
// START CAMERA
// =========================
export const startCamera = async (videoRef, detectFace, setExpression) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    const video = videoRef.current;

    video.srcObject = stream;

    await video.play();

    detectFace();
  } catch (error) {
    console.log(error);

    setExpression("Camera Error");
  }
};

// =========================
// STOP CAMERA
// =========================
export const stopCamera = (videoRef) => {
  const video = videoRef.current;

  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();

    tracks.forEach((track) => track.stop());
  }
};

// =========================
// FACE DETECTION LOOP
// =========================
export const detectFace = async (
  videoRef,
  faceLandmarkerRef,
  blendshapeRef,
  setExpression,
) => {
  const video = videoRef.current;

  const faceLandmarker = faceLandmarkerRef.current;

  // Wait until video is ready
  if (!video || !faceLandmarker || video.readyState < 2) {
    requestAnimationFrame(detectFace);
    return;
  }

  const results = faceLandmarker.detectForVideo(video, performance.now());

  // Face detected
  if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    blendshapeRef.current = blendshapes; //detectExpression(blendshapes);
  } else {
    setExpression("No Face Detected");
  }

  //   requestAnimationFrame(detectFace);
  requestAnimationFrame(() =>
    detectFace(videoRef, faceLandmarkerRef, blendshapeRef, setExpression),
  );
};

// =========================
// EXPRESSION DETECTION
// =========================
// export const detectExpression = (blendshapes) => {
//   const getScore = (name) => {
//     return blendshapes.find((shape) => shape.categoryName === name)?.score || 0;
//   };

//   // Smile
//   const smile = getScore("mouthSmileLeft") + getScore("mouthSmileRight");

//   // Mouth Open
//   const jawOpen = getScore("jawOpen");

//   // Angry
//   const browDown = getScore("browDownLeft") + getScore("browDownRight");

//   // Surprise
//   const surprise = jawOpen + getScore("eyeWideLeft") + getScore("eyeWideRight");

//   // =====================
//   // LOGIC
//   // =====================

//   if (smile > 0.7) {
//     setExpression("😊 Happy");
//   } else if (surprise > 1.2) {
//     setExpression("😲 Surprised");
//   } else if (browDown > 0.8) {
//     setExpression("😠 Angry");
//   } else {
//     setExpression("😐 Neutral");
//   }
// };
export const detectExpression = (blendshapes) => {
  const getScore = (name) => {
    return blendshapes.find((shape) => shape.categoryName === name)?.score || 0;
  };

  const smile = getScore("mouthSmileLeft") + getScore("mouthSmileRight");

  const jawOpen = getScore("jawOpen");

  const browDown = getScore("browDownLeft") + getScore("browDownRight");

  const surprise = jawOpen + getScore("eyeWideLeft") + getScore("eyeWideRight");

  if (smile > 0.7) {
    return "😊 Happy";
  } else if (surprise > 1.2) {
    return "😲 Surprised";
  } else if (browDown > 0.8) {
    return "😠 Angry";
  } else {
    return "😐 Neutral";
  }
};
