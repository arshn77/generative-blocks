// let seed = 3;

// USER CONTROL VARIABLES
let canControl = true;
let controls = {
  is3D: true,
  // numShapes: 1,
  // density: [13, 15, 2],
  // shapeFreq: shuffleArray([1, 0, 0, 0]),
  // shapeFreq: [0, 1, 0, 0],
  // theme: [...shuffleArray(["#DB4F54", "#1F3359", "#FCD265", "#B8D9CE"]), 0],
};

// UTILITY VARIABLES
let currentShapes = []; // To track overlapping for when we can't use Poisson
let simplexNoise = new openSimplexNoise(Math.random());

// GENERATED GLOBAL VARIABLES
const is3D_global = is3DGen();

function setup() {
  if (is3D_global) {
    createCanvas(400, 400, WEBGL);
    let camVal = 3100;
    camVal = 900;
    camera(camVal, -camVal, camVal, 0, 200, 0, 0, 1, 0);
    // perspective(0.11, width / height, 2000);
    // perspective(1);
  } else {
    createCanvas(400, 400);
  }

  rectMode(CENTER);

  // createEasyCam();
}

function draw() {
  background(230);
  // translate(0, 100, 0);
  // RANDOMLY GENERATED VARIABLES
  const is3D = is3D_global;
  const numShapes = numShapesGen(); // number of shapes to draw
  const shapeSize = 10;
  const margin = shapeSize / 2 + 2;
  const shapeFreq = shapeFreqGen();
  const theme = themeGen();
  const simplexNoiseParam = simplexNoiseParamGen();

  if (is3D) {
    lightingSetup();
  }

  // Math.seedrandom(seed);

  strokeWeight(1);
  frameRate(1);
  // orbitControl();
  // debugMode();

  if (numShapes !== "any") {
    for (let i = 0; i < numShapes; i++) {
      let x, y;
      do {
        x = getRand(175, 225); // random x-coordinate
        y = getRand(175, 225); // random y-coordinate
      } while (overlapsWithShapes(x, y, shapeSize));

      currentShapes.push({ x, y, size: shapeSize });
      if (is3D) {
        drawShape3D(x, y, shapeSize, shapeFreq, theme, simplexNoiseParam);
      } else {
        drawShape(x, y, shapeSize, shapeFreq, theme);
      }
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
      if (is3D) {
        drawShape3D(x, y, shapeSize, shapeFreq, theme, simplexNoiseParam);
      } else {
        drawShape(x, y, shapeSize, shapeFreq, theme);
      }
    });
  }

  strokeWeight(1);
  noFill();
  rectMode(CENTER);

  // rect(width / 2, height / 2, width - 1, height - 1);

  noLoop();
}
