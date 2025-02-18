let video;
let bodyPose;
let poses = [];
let connections;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  var canvas = createCanvas(640, 480);
  canvas.parent('p5Parent'); 

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

function draw() {
  // 绘制摄像头视频
  //image(video, 0, 0, width, height);

  // 绘制背景
  background("yellow");

  fill(0); // 设置文字颜色为黑色
  // textSize(36); // 设置文字大小

  // // 在左侧绘制文本
  // for (let y = 0; y < height; y += 36) {
  //   text("can you recognize", 10, y);
  // }

  // textSize(26); // 设置文字大小
  // // 在右侧绘制文本
  // for (let y = 0; y < height; y += 26) {
  //   text("who", width - 300, y);
  // }

  // textSize(20); // 设置文字大小

  // for (let y = 0; y < height; y += 15) {
  //   text("I", width - 200, y);
  // }

  // push();

  // for (let y = 0; y < height; y += 15) {
  //   rotate(radians(-20));
  //   text("I", width - 220, y);
  // }
  // pop();

  // textSize(48); // 设置文字大小
  // for (let y = 0; y < height; y += 45) {
  //   text("am?", width - 100, y);
  // }

  // translate(width, 0);
  // scale(-1, 1);

  // 绘制所有被检测到的关键点和连线
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];

    // 绘制连接 5（左肩）、6（右肩）和 11（左髋）的蓝色三角形
    let leftShoulder = pose.keypoints[5];
    let rightShoulder = pose.keypoints[6];
    let leftHip = pose.keypoints[11];
    let noseKeypoint = pose.keypoints[1];

    //nose
    fill(0, 0, 255);
    rect(pose.keypoints[1].x - 50, pose.keypoints[1].y - 50, 100, 100);
    console.log(pose.keypoints[1]);
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
      fill(0, 0, 255); 

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

function gotPoses(results) {
  poses = results;
}
