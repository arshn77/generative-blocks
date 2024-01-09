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
