function updateControls(e) {
  e.preventDefault();

  elements = e.target.elements;
}

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
    output.textContent = slider.value;
    updateProgressBar();
  });

  // Initial update of progress bar on page load
  updateProgressBar();
});
