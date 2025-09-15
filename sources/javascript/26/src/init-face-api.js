const video = document.getElementById("video");
let emotionResult;
let emotionArrSorted;
let cameraIsReady = false;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    //get emotion
    if (detections && detections[0]) {
      const emotion = detections[0].expressions;
      const emotionArr = Object.entries(emotion);
      emotionArrSorted = emotionArr.sort((a, b) => b[1] - a[1]);
      emotionResult = emotionArrSorted[0][0];
      
    }
    draw(detections);

    for (const face of detections) {
      // document.querySelector("#container").innerHTML = ''
      const features = {
        jaw: face.landmarks.positions.slice(0, 17),
        eyebrowLeft: face.landmarks.positions.slice(17, 22),
        eyebrowRight: face.landmarks.positions.slice(22, 27),
        noseBridge: face.landmarks.positions.slice(27, 31),
        nose: face.landmarks.positions.slice(31, 36),
        eyeLeft: face.landmarks.positions.slice(36, 42),
        eyeRight: face.landmarks.positions.slice(42, 48),
        lipOuter: face.landmarks.positions.slice(48, 60),
        lipInner: face.landmarks.positions.slice(60),
      };
      // console.log(features.nose[3].x, features.nose[3].y)
      // const div = document.createElement('div')
      // div.style.position = 'absolute'
      // div.style.zIndex = '9999'
      // div.style.width = '40px'
      // div.style.height = '40px'
      // div.style.borderRadius = '50%'
      // div.style.backgroundColor = 'red'
      // div.style.top = `${features.nose[3].y}px`
      // div.style.left = `${features.nose[3].x + 20}px`
      // document.querySelector("#container").append(div)
    }
  }, 100);
});
