let currentWiggle = 0;

function changeWiggle(direction) {
  currentWiggle += direction;
  // Ensure currentWiggle wraps around between 0 and 4
  if (currentWiggle < 0) {
    currentWiggle = 4;
  } else if (currentWiggle > 4) {
    currentWiggle = 0;
  }

  // Update the display of the current wiggle value
  document.getElementById('wiggleValue').textContent = currentWiggle;

  // Call the toggleWiggle function with the new value
  toggleWiggle(currentWiggle);
}

function toggleWiggle(value) {
  console.log("Wiggle set to:", value);
  wiggleType = value;
}


let myFaceLandmarker;
let faceLandmarks;
let myCapture;
let lastVideoTime = -1;
let randomColors = []; 
let strokeWeightV = 4;

let canvasSize = 480;
let videoWidth = 640;
let videoHeight = 480;
let offsetX = (videoWidth - canvasSize) / 2;
let offsetY = (videoHeight - canvasSize) / 2;
let wiggle = false;
let wiggleType = 0;
let strokeColorPicker, strokeColorPicker2; 

const trackingConfig = {
  doAcquireFaceMetrics: true,
  cpuOrGpuString: "CPU" /* "GPU" or "CPU" */,
  maxNumFaces: 5,
};

let bodyPose;
let poses = [];
let connections;

//------------------------------------------
async function preload() {
    bodyPose = ml5.bodyPose();
  const mediapipe_module = await import(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js"
  );
  FaceLandmarker = mediapipe_module.FaceLandmarker;
  FilesetResolver = mediapipe_module.FilesetResolver;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.7/wasm"
  );

  myFaceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    numFaces: trackingConfig.maxNumFaces,
    runningMode: "VIDEO",
    outputFaceBlendshapes: trackingConfig.doAcquireFaceMetrics,
    baseOptions: {
      delegate: trackingConfig.cpuOrGpuString,
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
  });
}

//------------------------------------------
async function predictWebcam() {
  let startTimeMs = performance.now();
  if (lastVideoTime !== myCapture.elt.currentTime) {
    if (myFaceLandmarker) {
      faceLandmarks = myFaceLandmarker.detectForVideo(
        myCapture.elt,
        startTimeMs
      );
    }
    lastVideoTime = myCapture.elt.currentTime;
  }
  window.requestAnimationFrame(predictWebcam);
}

//------------------------------------------
function setup() {
  var canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('p5Parent'); 
  myCapture = createCapture(VIDEO);
  myCapture.size(320, 240);
  myCapture.hide();

  bodyPose.detectStart(myCapture, gotPoses);
  connections = bodyPose.getSkeleton();
}

function draw() {
  push();
  translate(-(videoWidth - canvasSize)/2, 0);
  predictWebcam();
  if (wiggleType != 0){
    background(255);
    drawFacePoints();
  } else{
    background("yellow");
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i];
  
      let leftShoulder = pose.keypoints[5];
      let rightShoulder = pose.keypoints[6];
      let leftHip = pose.keypoints[11];
      let noseKeypoint = pose.keypoints[1];
  
      //nose
      fill(0, 0, 255);
      rect(pose.keypoints[1].x - 50, pose.keypoints[1].y - 50, 100, 100);
      //console.log(pose.keypoints[1]);
      //nose-text
      push();
      // translate(width, 0);
      // scale(-1, 1);
      stroke("magenta");
      strokeWeight(5);
      line(
        pose.keypoints[1].x,
        pose.keypoints[1].y,
        pose.keypoints[1].x * -1,
        pose.keypoints[1] * -1
      );
      fill(0);
      // textSize(18);
      // text("head", pose.keypoints[1].x, pose.keypoints[1].y);
      pop();
  
      //left arm
      beginShape();
      fill(0, 0, 0);
      vertex(pose.keypoints[5].x, pose.keypoints[5].y);
      vertex(pose.keypoints[7].x, pose.keypoints[7].y);
      vertex(pose.keypoints[9].x, pose.keypoints[9].y);
  
      endShape(CLOSE);
  
      push();
      // translate(width, 0);
      // scale(-1, 1);
      stroke("magenta");
      strokeWeight(5);
      line(
        pose.keypoints[1].x,
        pose.keypoints[1].y,
        pose.keypoints[1].x * -1,
        pose.keypoints[1] * -1
      );
      fill(0);
      // textSize(18);
      // text("leftarm", pose.keypoints[7].x, pose.keypoints[7].y);
      pop();
  
      //right arm
      beginShape();
      fill(0, 0, 0);
      vertex(pose.keypoints[6].x, pose.keypoints[6].y);
      vertex(pose.keypoints[8].x, pose.keypoints[8].y);
      vertex(pose.keypoints[10].x, pose.keypoints[10].y);
  
      endShape(CLOSE);
  
      push();
      // translate(width, 0);
      // scale(-1, 1);
      stroke("magenta");
      strokeWeight(5);
      line(
        pose.keypoints[1].x,
        pose.keypoints[1].y,
        pose.keypoints[1].x * -1,
        pose.keypoints[1] * -1
      );
      fill(0);
      // textSize(18);
      // text("rightarm", pose.keypoints[8].x, pose.keypoints[8].y);
      pop();
  
  //left leg
      fill(0, 255, 0);
      rect(pose.keypoints[11].x - 50, pose.keypoints[13].y - 50, 100, 100);
      
      // right leg
      rect(pose.keypoints[12].x - 50, pose.keypoints[14].y - 50, 100, 100);
          push();
      // translate(width, 0);
      // scale(-1, 1);
      stroke("magenta");
      strokeWeight(5);
      line(
        pose.keypoints[1].x,
        pose.keypoints[1].y,
        pose.keypoints[1].x * -1,
        pose.keypoints[1] * -1
      );
      fill(0);
      // textSize(18);
      // text("rightleg", pose.keypoints[12].x, pose.keypoints[12].y);
      pop();
       //hip
      if (
        leftShoulder.score > 0.1 &&
        rightShoulder.score > 0.1 &&
        leftHip.score > 0.1
      ) {
        fill(255, 0, 0);
  
        beginShape();
        vertex(leftShoulder.x, leftShoulder.y);
        vertex(rightShoulder.x, rightShoulder.y);
        vertex(leftHip.x, leftHip.y);
        endShape(CLOSE);
      }
      push();
      // translate(width, 0);
      // scale(-1, 1);
      stroke("magenta");
      strokeWeight(5);
      line(
        pose.keypoints[1].x,
        pose.keypoints[1].y,
        pose.keypoints[1].x * -1,
        pose.keypoints[1] * -1
      );
      fill(0);
      // textSize(18);
      // text("leftleg", pose.keypoints[11].x, pose.keypoints[11].y);
      pop();
  
      push();
      // translate(width, 0);
      // scale(-1, 1);
      stroke("magenta");
      strokeWeight(5);
      line(
        pose.keypoints[1].x,
        pose.keypoints[1].y,
        pose.keypoints[1].x * -1,
        pose.keypoints[1] * -1
      );
      fill(0);
      // textSize(18);
      // text("body", pose.keypoints[11].x - 80, pose.keypoints[11].y - 170);
      pop();
  
      for (let j = 0; j < connections.length; j++) {
        let pointAIndex = connections[j][0];
        let pointBIndex = connections[j][1];
        let pointA = pose.keypoints[pointAIndex];
        let pointB = pose.keypoints[pointBIndex];
  
        if (pointA.score > 0.1 && pointB.score > 0.1) {
          noStroke();
          strokeWeight(2);
          line(pointA.x, pointA.y, pointB.x, pointB.y);
        }
      }
    }
  }
  pop();
}

//------------------------------------------
// Tracks 478 points on the face.
function drawFacePoints() {
  if (faceLandmarks && faceLandmarks.faceLandmarks) {
    const nFaces = faceLandmarks.faceLandmarks.length;
    if (randomColors.length < nFaces) {
      randomColors = [];
      for (let i = 0; i < nFaces; i++) {
        randomColors.push(color(random(255), random(255), random(255)));
      }
    }
    if (nFaces > 0) {
      for (let f = 0; f < nFaces; f++) {
        let aFace = faceLandmarks.faceLandmarks[f];
        if (aFace) {
          let nFaceLandmarks = aFace.length;

          noFill();
          //stroke(strokeColorPicker.color());
          stroke(randomColors[f]);
          strokeWeight(strokeWeightV);
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE);
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE);
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW);
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW);
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL);
          //	drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LIPS);
          drawConnectors(aFace, FACELANDMARKER_NOSE); // Google offers no nose
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS);
          drawConnectors(aFace, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS);

          drawBigMouth(aFace);
        }
      }
    }
  }
}

function drawBigMouth(landmarks) {
  strokeWeight(strokeWeightV);
  if (landmarks) {
    let connectorSet = FaceLandmarker.FACE_LANDMARKS_LIPS;
    let nMouthLines = connectorSet.length;
    let avgx = 0;
    let avgy = 0;
    for (let i = 0; i < nMouthLines; i++) {
      let index0 = connectorSet[i].start;
      let x0 = map(landmarks[index0].x, 0, 1, videoWidth, 0);
      let y0 = map(landmarks[index0].y, 0, 1, 0, videoHeight);
      avgx += x0;
      avgy += y0;
    }
    avgx /= nMouthLines;
    avgy /= nMouthLines;

    push();
    translate(avgx, avgy); // draw the mouth at its centroid (or somewhere else)
    // rotate(PI); // rotate it 180°

    let S = 2; //2.0 + sin(millis()/400.0);
    for (let i = 0; i < nMouthLines; i++) {
      let index0 = connectorSet[i].start;
      let index1 = connectorSet[i].end;
      let x0 = S * (map(landmarks[index0].x, 0, 1, videoWidth, 0) - avgx);
      let y0 = S * (map(landmarks[index0].y, 0, 1, 0, videoHeight) - avgy);
      let x1 = S * (map(landmarks[index1].x, 0, 1, videoWidth, 0) - avgx);
      let y1 = S * (map(landmarks[index1].y, 0, 1, 0, videoHeight) - avgy);

      //stroke(strokeColorPicker2.color());
      stroke(255,0,0);
      
      if (wiggleType == 1) {
        line(x0, y0, x1, y1);
      }else if (wiggleType == 2) {
        let offset = 5; // Max offset for the wiggle
        x0 += random(-offset, offset);
        y0 += random(-offset, offset);
        x1 += random(-offset, offset);
        y1 += random(-offset, offset);
        line(x0, y0, x1, y1);
      } else if (wiggleType == 3) {
        let time = millis() / 1000;
        let wiggleAmount = -10; // Maximum displacement for the wiggle
        let frequency = 2 * PI * 2; // Adjust frequency here (2 cycles per second)
        let wiggleX = wiggleAmount * sin(frequency * time);
        let wiggleY = wiggleAmount * cos(frequency * time);
        x0 += wiggleX;
        y0 += wiggleY;
        x1 += wiggleX;
        y1 += wiggleY;
        line(x0, y0, x1, y1);
      } else if (wiggleType == 4) {
        let noiseScale = 1; // Scale of the noise
        let noiseStrength = 20; // Strength of the movement, in pixels
        let nx0 =
          x0 +
          noise(frameCount * noiseScale + index0) * noiseStrength -
          noiseStrength / 2;
        let ny0 =
          y0 +
          noise(frameCount * noiseScale + index0) * noiseStrength -
          noiseStrength / 2;
        let nx1 =
          x1 +
          noise(frameCount * noiseScale + index1) * noiseStrength -
          noiseStrength / 2;
        let ny1 =
          y1 +
          noise(frameCount * noiseScale + index1) * noiseStrength -
          noiseStrength / 2;
        line(nx0, ny0, nx1, ny1);
      }    
    }
    pop();
  }
}

//------------------------------------------
function drawConnectors(landmarks, connectorSet) {

  if (landmarks) {
    let nConnectors = connectorSet.length;
    for (let i = 0; i < nConnectors; i++) {
      let index0 = connectorSet[i].start;
      let index1 = connectorSet[i].end;

      //if (skipIndices.includes(index0)) continue;

      let x0 = map(landmarks[index0].x, 0, 1, videoWidth, 0);
      let y0 = map(landmarks[index0].y, 0, 1, 0, height);
      let x1 = map(landmarks[index1].x, 0, 1, videoWidth, 0);
      let y1 = map(landmarks[index1].y, 0, 1, 0, height);

      
      if (wiggleType == 0) {
        line(x0, y0, x1, y1);
      }else if (wiggleType == 1) {
        let offset = 5; // Max offset for the wiggle
        x0 += random(-offset, offset);
        y0 += random(-offset, offset);
        x1 += random(-offset, offset);
        y1 += random(-offset, offset);
        line(x0, y0, x1, y1);
      } else if (wiggleType == 2) {
        let time = millis() / 1000;
        let wiggleAmount = 10; // Maximum displacement for the wiggle
        let frequency = 2 * PI * 2; // Adjust frequency here (2 cycles per second)
        let wiggleX = wiggleAmount * sin(frequency * time);
        let wiggleY = wiggleAmount * cos(frequency * time);
        x0 += wiggleX;
        y0 += wiggleY;
        x1 += wiggleX;
        y1 += wiggleY;
        line(x0, y0, x1, y1);
      } else if (wiggleType == 3) {
        let noiseScale = 1; // Scale of the noise
        let noiseStrength = 20; // Strength of the movement, in pixels
        let nx0 =
          x0 +
          noise(frameCount * noiseScale + index0) * noiseStrength -
          noiseStrength / 2;
        let ny0 =
          y0 +
          noise(frameCount * noiseScale + index0) * noiseStrength -
          noiseStrength / 2;
        let nx1 =
          x1 +
          noise(frameCount * noiseScale + index1) * noiseStrength -
          noiseStrength / 2;
        let ny1 =
          y1 +
          noise(frameCount * noiseScale + index1) * noiseStrength -
          noiseStrength / 2;
        line(nx0, ny0, nx1, ny1);
      }
      //}
    }
  }
}

function drawFaceMetrics() {
  if (trackingConfig.doAcquireFaceMetrics) {
    if (faceLandmarks && faceLandmarks.faceBlendshapes) {
      const nFaces = faceLandmarks.faceLandmarks.length;
      for (let f = 0; f < nFaces; f++) {
        let aFaceMetrics = faceLandmarks.faceBlendshapes[f];
        if (aFaceMetrics) {
          fill("black");
          textSize(10.5);
          let tx = 50;
          let ty = 40;
          let dy = 11;
          let vx0 = tx - 5;
          let vx1 = 5;

          let nMetrics = aFaceMetrics.categories.length;
          for (let i = 1; i < nMetrics; i++) {
            let metricName = aFaceMetrics.categories[i].categoryName;
            noStroke();
            text(metricName, tx, ty);

            let metricValue = aFaceMetrics.categories[i].score;
            let vx = map(metricValue, 0, 1, vx0, vx1);
            stroke(0, 0, 0);
            strokeWeight(strokeWeightV);
            line(vx0, ty - 2, vx, ty - 2);
            stroke(0, 0, 0, 20);
            line(vx0, ty - 2, vx1, ty - 2);
            ty += dy;
          }
        }
      }
    }
  }
}



function gotPoses(results) {
    poses = results;
  }