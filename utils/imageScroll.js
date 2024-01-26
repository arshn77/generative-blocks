// gpt generated

let images = [];
for (let i = 1; i <= 25; i++) {
  images.push(`/generative-blocks/images/${i}.jpg`);
  images.push(`/generative-blocks/images/${i}.png`);
}

let imageIndex = 0;

function loadImages() {
  if (imageIndex >= 25) return;

  let loadedImages = 0;
  while (loadedImages < 3 && imageIndex < images.length) {
    const img = document.createElement("img");
    img.onload = function () {
      loadedImages++;
    };
    img.onerror = function () {
      this.style.display = "none"; // Hide the image if it fails to load
    };
    img.src = images[imageIndex];
    imageIndex++;
    document.getElementById("image-container").appendChild(img);
  }
}

let initialLoad = true;

// document.getElementById("load-more").addEventListener("click", loadImages);

loadImages(); // Load initial images
