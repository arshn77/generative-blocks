let canControl = false;
let controls = {
  numShapes: "any",
  // density: [13, 15, 2],
  // shapeFreq: shuffleArray([1, 0, 0, 0]),
  // theme: [...shuffleArray(["#DB4F54", "#1F3359", "#FCD265", "#B8D9CE"]), 0],
};
let currentShapes = []; // To track overlapping for when we can't use Poisson

let camXSlider, camYSlider, camZSlider;

function setup() {
  createCanvas(400, 400, WEBGL);
  // camXSlider = createSlider(-1000, 1000, 600);
  // camYSlider = createSlider(-1000, 1000, -200);
  // camZSlider = createSlider(-1000, 1000, 600);
  // camXSlider.position(10, 10);
  // camYSlider.position(10, 30);
  // camZSlider.position(10, 50);
  let camVal = 3100;
  camera(camVal, -camVal, camVal, 0, 200, 0, 0, 1, 0);
  perspective(0.11);
}

function draw() {
  const is3D = is3DGen();
  rotateX(PI / 2);
  // if (is3D) {
  //   createCanvas(400, 400, WEBGL);
  //   camera(600, -200, 600, 200, 200, 200);
  // }
  // const camX = camXSlider.value();
  // const camY = camYSlider.value();
  // const camZ = camZSlider.value();
  background(230);
  // camera(600, -600, 600, 200, 200, 0);
  // camera(10, 0, 0);
  // perspective(0.01, width / height, 0.1, 1000);
  // ortho(-width, width, height, -height, -height, height);

  // box(50);

  strokeWeight(1);
  frameRate(1);

  const numShapes = numShapesGen(); // number of shapes to draw
  const shapeSize = 10;
  const margin = shapeSize / 2 + 2;
  const shapeFreq = shapeFreqGen();
  const theme = themeGen();

  if (numShapes !== "any") {
    for (let i = 0; i < numShapes; i++) {
      let x, y;
      do {
        x = getRand(175, 225); // random x-coordinate
        y = getRand(175, 225); // random y-coordinate
      } while (overlapsWithShapes(x, y, shapeSize));

      currentShapes.push({ x, y, size: shapeSize });
      drawShape3D(x, y, shapeSize, shapeFreq, theme);
    }
  } else {
    // width and height need to be modified if we change
    // the center
    [minDistance, maxDistance, tries] = densityGen();
    const pds = new PoissonDiskSampling({
      shape: [width - 2 * margin, height - 2 * margin],
      minDistance: minDistance,
      maxDistance: maxDistance,
      tries: tries,
    });

    // Generate the points
    const points = pds.fill();

    // Todo: Remove points if too low

    // Drawing the shapes
    points.forEach(([x, y]) => {
      x += margin;
      y += margin;
      drawShape3D(x, y, shapeSize, shapeFreq, theme);
    });
  }

  // for (let i = 0; i < numShapes; i++) {
  //   do {
  //     const x = random(width - shapeSize); // random x-coordinate
  //     const y = random(height - shapeSize); // random y-coordinate
  //   } while (overlapsWithShapes(x, y, shapeSize));

  //   const shapeType = floor(random(2)); // random shape type
  //   // Depending on the shape type, draw a circle or a rectangle
  //   if (shapeType === 0) {
  //     ellipse(x, y, 50, 50); // draw a circle
  //   } else {
  //     rect(x, y, 50, 50); // draw a rectangle
  //   }
  // }
  strokeWeight(1);
  noFill();
  rect(0, 0, width - 1, height - 1);

  noLoop();
}

// Math.random() returns [0,1)
// You can always put 1 for final property

// GENERATION PROBABILITIES
function numShapesGen() {
  const dataArray = [
    { probability: 0.05, result: 1 },
    { probability: 0.05, result: getRand(2, 5) },
    { probability: 1, result: "any" },
  ];

  return canControl && controls.numShapes ? controls.numShapes : cdf(dataArray);
}

function is3DGen() {
  const dataArray = [
    { probability: 0.4, result: false },
    { probability: 1, result: true },
  ];

  return canControl && controls.is3D ? controls.is3D : cdf(dataArray);
}

// Have to re-edit values for diff shape sizes
function densityGen(shapeSize) {
  const dataArray = [
    // Density is in form of [minDistance, maxDistance, tries]
    { probability: 0.05, result: [10, 13, 200] }, // very packed
    { probability: 0.15, result: [25, 40, 30] }, // not packed
    {
      probability: 1,
      result: [getRand(10, 18), getRand(14, 30), getRand(1, 7)],
    }, // in-between
  ];

  return canControl && controls.density ? controls.density : cdf(dataArray);
}

function shapeFreqGen() {
  const dataArray = [
    // In form of four different frequencies
    { probability: 0.05, result: [1, 0, 0, 0] }, // one shape
    { probability: 0.05, result: [0.5, 0.5, 0, 0] }, // two shape
    { probability: 0.05, result: [0.7, 0.3, 0, 0] }, // two shape 70/30
    { probability: 0.1, result: [0.33, 0.33, 0.34, 0] }, // three shape
    { probability: 1, result: [0.25, 0.25, 0.25, 0.25] }, // four shape
  ];

  let result = cdf(dataArray);

  // Frequencies shuffled before return
  return canControl && controls.shapeFreq
    ? controls.shapeFreq
    : shuffleArray(result);
}

function themeGen() {
  const dataArray = [
    // Names tbd, format [circle, square, tri, diam, strokeWeight]
    { probability: 0.1, result: ["white", "white", "white", "white", 0.2] }, //
    { probability: 0.1, result: ["black", "black", "black", "black", 0] }, //
    {
      probability: 0.1,
      result: [...shuffleArray(["blue", "red", "yellow", "purple"]), 0],
    }, //
    {
      probability: 0.1,
      result: [...shuffleArray(["black", "red", "black", "red"]), 0],
    }, //
    { probability: 1, result: ["blue", "red", "yellow", "purple", 0] }, //
  ];

  return canControl && controls.theme ? controls.theme : cdf(dataArray);
}

// UTILITY FUNCTIONS

// Cumulative distribution function -- chatGPT
function cdf(dataArray) {
  const rand = Math.random();
  let sum = 0;

  for (let data of dataArray) {
    sum += data.probability;
    if (rand < sum) {
      return data.result;
    }
  }
}

// Fisher-Yates shuffle -- chatGPT
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawShape(x, y, size, frequencies, theme) {
  const rand = Math.random();

  let cumulativeFreq = [
    frequencies[0],
    frequencies[0] + frequencies[1],
    frequencies[0] + frequencies[1] + frequencies[2],
    frequencies[0] + frequencies[1] + frequencies[2] + frequencies[3],
  ];

  console.log(cumulativeFreq);
  strokeWeight(theme[4]);
  console.log(theme[4]);

  for (let i = 0; i < cumulativeFreq.length; i++) {
    if (rand < cumulativeFreq[i]) {
      if (i === 0) {
        fill(theme[0]);
        ellipse(x, y, size);
        //
      } else if (i === 1) {
        fill(theme[1]);
        square(x - size / 2, y - size / 2, size);
        //
      } else if (i === 2) {
        fill(theme[2]);
        const halfBase = size / 2;
        const height = Math.sqrt(size * size - halfBase * halfBase);
        triangle(
          x - halfBase,
          y + height / 2,
          x + halfBase,
          y + height / 2,
          x,
          y - height / 2
        );
        //
      } else if (i === 3) {
        fill(theme[3]);
        quad(
          x,
          y - size / 2,
          x + size / 2,
          y,
          x,
          y + size / 2,
          x - size / 2,
          y
        );
      }
      break;
    }
  }
}

// Overlapping for when we can't use poisson
function overlapsWithShapes(x, y, size) {
  for (let i = 0; i < currentShapes.length; i++) {
    const shape = currentShapes[i];
    const distance = dist(x, y, shape.x, shape.y);
    if (distance < size + shape.size) {
      return true;
    }
  }
  return false;
}

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawShape3D(x, y, size, frequencies, theme) {
  const rand = Math.random();

  let cumulativeFreq = [
    frequencies[0],
    frequencies[0] + frequencies[1],
    frequencies[0] + frequencies[1] + frequencies[2],
    frequencies[0] + frequencies[1] + frequencies[2] + frequencies[3],
  ];

  console.log(cumulativeFreq);
  strokeWeight(theme[4]);
  console.log(theme[4]);

  for (let i = 0; i < cumulativeFreq.length; i++) {
    if (rand < cumulativeFreq[i]) {
      if (i === 0) {
        fill(theme[0]);
        push();
        translate(x, y, 0);
        rotateX(HALF_PI);
        cylinder(size / 2, getRand(size, 200)); // 3D ellipse
        pop();
      } else if (i === 1) {
        fill(theme[1]);
        push();
        translate(x, y, 0);
        box(size, size, getRand(size, 200)); // 3D box
        pop();
      } else if (i === 2) {
        fill(theme[2]);
        // 3D triangle
        const halfBase = size / 2;
        const height = Math.sqrt(size * size - halfBase * halfBase);
        beginShape();
        vertex(x, y, 0);
        vertex(x + size / 2, y + size, 0);
        vertex(x, y, size * 2);
        endShape(CLOSE);
      } else if (i === 3) {
        fill(theme[3]);
        // 3D diamond
        beginShape();
        vertex(x, y, 0);
        vertex(x + size / 2, y, size);
        vertex(x, y, size * 2);
        vertex(x - size / 2, y, size);
        endShape(CLOSE);
      }
      break;
    }
  }
}
