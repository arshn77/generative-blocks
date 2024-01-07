// let seed = 3;

// USER CONTROL VARIABLES
let canControl = false;
let controls = {
  numShapes: 1,
  // density: [13, 15, 2],
  // shapeFreq: shuffleArray([1, 0, 0, 0]),
  shapeFreq: [0, 1, 0, 0],
  // theme: [...shuffleArray(["#DB4F54", "#1F3359", "#FCD265", "#B8D9CE"]), 0],
};

// UTILITY VARIABLES
let currentShapes = []; // To track overlapping for when we can't use Poisson
let simplexNoise = new openSimplexNoise(Math.random());

function setup() {
  createCanvas(400, 400, WEBGL);
  let camVal = 3100;
  camVal = 900;
  camera(camVal, -camVal, camVal, 0, 200, 0, 0, 1, 0);
  // perspective(0.11, width / height, 2000);
  // perspective(1);

  rectMode(CENTER);

  // createEasyCam();
}

function draw() {
  background(230);
  // translate(0, 100, 0);

  // Math.seedrandom(seed);
  // ambientLight(100);
  const lightVal = 255;

  directionalLight(200, 200, 200, 0.5, -0.5, -1);
  directionalLight(150, 150, 150, -0.5, 0.5, 1);
  // lights();

  ambientLight(230);

  rotateX(PI / 2);

  push();
  ambientMaterial(255);
  translate(200, 200, -1);
  box(width - 1, height - 1, 1);
  pop();
  // rect(width / 2, height / 2, width - 1, height - 1);

  strokeWeight(1);
  frameRate(1);
  // orbitControl();
  // debugMode();

  // RANDOMLY GENERATED VARIABLES
  const is3D = is3DGen();
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

  strokeWeight(1);
  noFill();
  rectMode(CENTER);

  // rect(width / 2, height / 2, width - 1, height - 1);

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
    { probability: 0.1, result: [10, 13, 200] }, // very packed
    { probability: 0.03, result: [25, 40, 30] }, // not packed
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
      result: [...shuffleArray(["blue", "red", "#FF9900", "purple"]), 0],
    }, //
    {
      probability: 0.1,
      result: [...shuffleArray(["black", "red", "black", "red"]), 0],
    }, //
    { probability: 1, result: ["blue", "red", "#FF9900", "purple", 0] }, //
  ];

  console.log("theme");
  console.log(cdf(dataArray));

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
      console.log(data.result);
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

  strokeWeight(theme[4]);
  // console.log(theme[4]);

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

  strokeWeight(1);

  let noiseScale = 0.009;

  for (let i = 0; i < cumulativeFreq.length; i++) {
    if (rand < cumulativeFreq[i]) {
      ambientMaterial(color(theme[i]));

      let noise =
        (simplexNoise.noise2D(noiseScale * x, noiseScale * y) + 1) / 2;
      let zHeight = noise * 300;

      push();
      translate(x, y, zHeight / 2);
      if (i === 0) {
        strokeWeight(0);

        push();
        if (theme[0] === "white") {
          strokeWeight(theme[4]);
        }
        rotateX(HALF_PI);
        cylinder(size / 2, zHeight); // 3D cylinder
        pop();
        push();
        strokeWeight(0.5);

        translate(0, 0, zHeight / 2);

        ellipse(0, 0, size);
        pop();
      } else if (i === 1) {
        box(size, size, zHeight); // 3D box
      } else if (i === 2) {
        let triColor = color(theme[2]);

        // 3D triangle
        pop();
        drawTriangularPrism(x, y, size, triColor, zHeight);
      } else if (i === 3) {
        // 3D diamond
        rotateZ(PI / 4);
        box(size, size, zHeight);
      }
      pop();
      break;
    }
  }
}

function drawTriangularPrism(x, y, size, triColor, zHeight) {
  const halfBase = size / 2;
  const height = Math.sqrt(size * size - halfBase * halfBase);

  ambientMaterial(triColor);

  // Bottom triangle
  triangle(
    x - halfBase,
    y + height / 2,
    x + halfBase,
    y + height / 2,
    x,
    y - height / 2
  );

  // Top triangle
  push();
  translate(0, 0, zHeight);
  triangle(
    x - halfBase,
    y + height / 2,
    x + halfBase,
    y + height / 2,
    x,
    y - height / 2
  );
  pop();

  let side1 = buildGeometry(() => {
    beginShape();
    vertex(x - halfBase, y + height / 2, zHeight);
    vertex(x + halfBase, y + height / 2, zHeight);
    vertex(x + halfBase, y + height / 2, 0);
    vertex(x - halfBase, y + height / 2, 0);
    endShape(CLOSE);
  });
  side1.computeNormals();
  model(side1);

  let side2 = buildGeometry(() => {
    beginShape();
    vertex(x - halfBase, y + height / 2, zHeight);
    vertex(x, y - height / 2, zHeight);
    vertex(x, y - height / 2, 0);
    vertex(x - halfBase, y + height / 2, 0);
    endShape(CLOSE);
  });
  side2.computeNormals();
  model(side2);

  let side3 = buildGeometry(() => {
    beginShape();
    vertex(x + halfBase, y + height / 2, zHeight);
    vertex(x, y - height / 2, zHeight);
    vertex(x, y - height / 2, 0);
    vertex(x + halfBase, y + height / 2, 0);
    endShape(CLOSE);
  });

  side3.computeNormals();
  model(side3);
}
