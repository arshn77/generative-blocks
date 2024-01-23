function updateControls(e) {
  e.preventDefault();

  elements = e.target.elements;

  canControl = true;
  controls = {
    density: [
      parseFloat(elements.minDistance.value),
      parseFloat(elements.maxDistance.value),
      60,
    ],
    simplexNoiseParam: {
      noiseScale: 0.007 * parseFloat(elements.variance.value) + 0.002,
      maxHeight: parseFloat(elements.maxHeight.value),
    },
    numShapes:
      parseInt(elements.numShapes.value) === 6
        ? "any"
        : parseInt(elements.numShapes.value),
  };

  // Setting shape freq
  circleRatio = parseFloat(elements.circle.value);
  squareRatio = parseFloat(elements.square.value);
  triangleRatio = parseFloat(elements.triangle.value);
  diamondRatio = parseFloat(elements.diamond.value);

  totalShapeRatio =
    circleRatio + squareRatio + triangleRatio + diamondRatio + 0.0001;

  controls.shapeFreq = [
    circleRatio / totalShapeRatio,
    squareRatio / totalShapeRatio,
    triangleRatio / totalShapeRatio,
    diamondRatio / totalShapeRatio,
  ];

  // Setting dimension
  switch (elements.dimension.value) {
    case "2D":
      controls.is3D = false;
      break;
    case "3D":
      controls.is3D = true;
      break;
  }

  // Setting size
  switch (elements.shapeSize.value) {
    case "small":
      controls.shapeSize = 10;
      break;
    case "medium":
      controls.shapeSize = 30;
      break;
    case "large":
      controls.shapeSize = 50;
      break;
  }

  // Setting theme
  switch (elements.theme.value) {
    case "primary":
      controls.theme = ["blue", "red", "yellow", "purple", 0];
      break;
    case "utopia":
      controls.theme = ["white", "white", "white", "white", 0.2];
      break;
    case "midnight":
      controls.theme = ["black", "black", "black", "black", 0];
      break;
    case "crimson":
      controls.theme = [...shuffleArray(["black", "red", "black", "red"]), 0];
      break;
    case "shuffled":
      controls.theme = [
        ...shuffleArray(["blue", "red", "yellow", "purple"]),
        0,
      ];
      break;
    default:
      console.log("setting theme not working");
  }

  // Finally redraw
  resetup();
  redraw();
}

// Some GPT help for styling using javascript
// Select all sliders
const sliders = document.querySelectorAll("input[type=range]");

sliders.forEach((slider) => {
  // Get the output element for this slider
  const output = slider.nextElementSibling;

  const updateProgressBar = () => {
    const ratio =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, black 0%, black ${ratio}%, #ddd ${ratio}%, #ddd 100%)`;
  };

  slider.addEventListener("input", function () {
    let value = slider.value;

    // Mimic datalist functionality
    if (slider.id === "numShapes" && value == 6) {
      value = "A lot";
    }

    output.textContent = value;
    updateProgressBar();
  });

  // Initial update of progress bar on page load

  updateProgressBar();
  if (slider.id === "numShapes" && slider.value == 6) {
    output.textContent = "A lot";
  }
});

function saveImages(i = 0) {
  if (i >= 50) return;
  canControl = false;

  resetup();
  redraw();
  saveCanvas();

  setTimeout(() => saveImages(i + 1), 1000); // Wait for 1 second
}
