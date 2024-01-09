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
