const video = document.getElementById("video");
const resultDiv = document.getElementById("result");
const videoContainer = document.getElementById("video-container");
const MODEL_URI = "models";
const PROBABILITY_THRESHOLD = 0.6;
const LOOK_OUT_THRESHOLD = 5;
const EXPRESSION_STACK_LENGTH = 6;

let fps = 0;
let y_angle = 0;

let currentExpression = ''
let expressionStack = []
// let currentCount = ''
// let comfirmedState = ''

let angleOutFrom = 0
let angleOutDuration = 0
let isLookOut = false


setInterval(() => {
  if(!expressionStack || expressionStack.length === 0) {
    return
  }
  const occurrences = expressionStack.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});

  let maxOccur = 0
  let maxOccurExpression = ''
  for (let key in occurrences) {
    if (occurrences[key] > maxOccur) {
      maxOccur = occurrences[key]
      maxOccurExpression = key
    }
  }

  currentExpression = maxOccurExpression

  resultDiv.innerHTML = `
    <div class="flex"><div class="w-[120px]">FPS</div> <b>${fps}</b></div>
  `
  resultDiv.innerHTML += `
    <div class="flex">
      ${isLookOut?'<div class="w-[120px] text-red-500 font-bold mr-1">NOT_FOCUSING</div>'+angleOutDuration+'s':''} </div>
  `

  resultDiv.innerHTML += `
    <div class="flex"><div class="w-[120px]">Expression</div>${currentExpression}</div>
  `
  if (parent) {
    parent.postMessage(JSON.stringify({ face: { 
      expression: currentExpression,
      isLookOut: isLookOut,
      lookoutDuration: angleOutDuration,
      fps: fps,
      y_angle: y_angle
    } }), '*')
  }
}, 300)

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
  faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI),
  faceapi.nets.ageGenderNet.loadFromUri(MODEL_URI),
])
  .then(playVideo)
  .catch((err) => {
    console.log(err);
  });

function getTop(l) {
  return l.map((a) => a.y).reduce((a, b) => Math.min(a, b));
}

function getMeanPosition(l) {
  return l.map((a) => [a.x, a.y]).reduce((a, b) => [a[0] + b[0], a[1] + b[1]]).map((a) => a / l.length);
}


function playVideo() {
  if (!navigator.mediaDevices) {
    console.error("mediaDevices not supported");
    return;
  }
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 360, ideal: 720, max: 1080 },
      },
      audio: false,
    })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log(err);
    });
}
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);

  canvas.willReadFrequently = true;
  videoContainer.appendChild(canvas);
  const canvasSize = { width: video.clientWidth, height: video.clientHeight };
  faceapi.matchDimensions(canvas, canvasSize);

  setInterval(async () => {
    let from = new Date().getTime()
    // detectAllFaces

    // const detections = await faceapi
    //   .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    //   // .withFaceLandmarks()
    //   .withFaceExpressions()
    // // .withAgeAndGender();

    const detections = await faceapi.detectSingleFace(video,
      new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      // .withFaceDescriptor()
      .withFaceExpressions()
    .withAgeAndGender();

    if (!detections || !detections.landmarks || !detections.detection) {
      return
    }

    let right_eye = getMeanPosition(detections["landmarks"].getRightEye());
    let left_eye = getMeanPosition(detections["landmarks"].getLeftEye());
    let nose = getMeanPosition(detections["landmarks"].getNose());
    let mouth = getMeanPosition(detections["landmarks"].getMouth());
    let jaw = getTop(detections["landmarks"].getJawOutline());

    let rx = (jaw - mouth) / detections["detection"]["_box"]["_height"];
    let ry = (left_eye[0] + (right_eye[0] - left_eye[0]) / 2 - nose[0]) / detections["detection"]["_box"]["_width"];

    let face_val = ry.toFixed(2);
    y_angle = ry.toFixed(2);
    let x_angle = rx.toFixed(2);

    if (face_val < -0.035 || face_val >= 0.035 ){
      if(!angleOutFrom) {
        angleOutFrom = new Date().getTime()
      }
      angleOutDuration = Math.round((new Date().getTime() - angleOutFrom)/1000)
    } else {
      angleOutFrom = 0
      angleOutDuration = 0
    }

    if(angleOutDuration >= LOOK_OUT_THRESHOLD) {
      isLookOut = true
    } else {
      isLookOut = false
    }

    fps = Math.round(1000 / (new Date().getTime() - from))

    // console.log('detections', detections);
    let result = null

    if (detections.detection && detections.detection._score >= PROBABILITY_THRESHOLD) {
      result = {
        box: {
          x: detections.detection._box._x,
          y: detections.detection._box._y,
          width: detections.detection._box._width,
          height: detections.detection._box._height
        },
        score: Math.round(detections.detection._score * 100),
        age: Math.round(detections.age),
      }

      if (detections.genderProbability > PROBABILITY_THRESHOLD) {
        result.gender = detections.gender
        result.genderProbability = Math.round(detections.genderProbability * 100)
      }

      if (detections.expressions) {
        let expressions = []
        for (let key in detections.expressions) {
          if (!isNaN(detections.expressions[key]) && detections.expressions[key] >= PROBABILITY_THRESHOLD) {
            expressions.push({
              name: key,
              probability: Math.round(detections.expressions[key] * 100)
            })
          }
        }
        expressions.sort((a, b) => {
          return b.probability - a.probability
        })
        result.expressions = expressions
        if (expressions.length > 0) {
          result.expression = expressions[0].name
          result.expressionProbability = expressions[0].probability
        } else {
          result.expression = "Unknown"
          result.expressionProbability = 100
        }
        expressionStack.push(result.expression)
        if(expressionStack.length > EXPRESSION_STACK_LENGTH) {
          expressionStack.shift()
        }
      }
    }
  }, 200);
});
