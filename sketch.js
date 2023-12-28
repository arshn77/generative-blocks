let canControl = false;
let controls = {
  numShapes: 1,
  density: [13, 14, 300],
  shapeFreq: shuffleArray([1, 0, 0, 0]),
};
let currentShapes = []; // To track overlapping for when we can't use Poisson

function setup() {
  createCanvas(400, 400);
}

function draw() {
  // background(220);
  background(255);
  noStroke();

  const numShapes = numShapesGen(); // number of shapes to draw
  const shapeSize = 10;
  const margin = shapeSize / 2 + 2;
  const shapeFreq = shapeFreqGen();

  if (numShapes !== "any") {
    for (let i = 0; i < numShapes; i++) {
      let x, y;
      do {
        x = getRand(175, 225); // random x-coordinate
        y = getRand(175, 225); // random y-coordinate
      } while (overlapsWithShapes(x, y, shapeSize));

      currentShapes.push({ x, y, size: shapeSize });
      drawShape(x, y, shapeSize, shapeFreq);
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

    // Drawing the shapes
    points.forEach(([x, y]) => {
      x += margin;
      y += margin;
      drawShape(x, y, shapeSize, shapeFreq);
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
  stroke(0);
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
  return canControl ? controls.numShapes : cdf(dataArray);
}

// Have to re-edit values for diff shape sizes
function densityGen(shapeSize) {
  const dataArray = [
    // Density is in form of [minDistance, maxDistance, tries]
    { probability: 0.05, result: [10, 13, 300] }, // very packed
    { probability: 0.15, result: [25, 40, 30] }, // not packed
    {
      probability: 1,
      result: [getRand(10, 18), getRand(14, 30), getRand(40, 200)],
    }, // in-between
  ];

  return canControl ? controls.density : cdf(dataArray);
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
  return canControl ? controls.shapeFreq : shuffleArray(result);
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

function drawShape(x, y, size, frequencies) {
  const rand = Math.random();
  let sum = 0;

  let cumulativeFreq = [
    frequencies[0],
    frequencies[0] + frequencies[1],
    frequencies[0] + frequencies[1] + frequencies[2],
    frequencies[0] + frequencies[1] + frequencies[2] + frequencies[3],
  ];

  console.log(cumulativeFreq);

  for (let i = 0; i < cumulativeFreq.length; i++) {
    console.log(i);
    console.log(rand);
    console.log(sum);
    if (rand < cumulativeFreq[i]) {
      console.log("draw it");
      if (i == 0) {
        fill("blue");
        ellipse(x, y, size);
        //
      } else if (i == 1) {
        fill("red");
        square(x - size / 2, y - size / 2, size);
        //
      } else if (i == 2) {
        fill("yellow");
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
      } else if (i == 3) {
        fill("purple");
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
