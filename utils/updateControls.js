function updateControls(e) {
  e.preventDefault();

  elements = e.target.elements;
}

const slider = document.getElementById("mySlider");
const output = document.getElementById("sliderOutput");

const updateProgressBar = () => {
  const ratio = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, black 0%, black ${ratio}%, #ddd ${ratio}%, #ddd 100%)`;
};

slider.addEventListener("input", function () {
  output.textContent = slider.value;
  updateProgressBar();
});

// Initial update of progress bar on page load
updateProgressBar();
