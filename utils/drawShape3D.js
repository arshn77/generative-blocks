function drawShape3D(x, y, size, frequencies, theme, noiseParams) {
  const rand = Math.random();

  let cumulativeFreq = [
    frequencies[0],
    frequencies[0] + frequencies[1],
    frequencies[0] + frequencies[1] + frequencies[2],
    frequencies[0] + frequencies[1] + frequencies[2] + frequencies[3],
  ];

  // Map yellow values to orange, because orange looks yellow in 3D
  // with my current lighting. God knows why, I'm not a 3D artist
  theme = theme.map((value) => (value === "yellow" ? "#FF9900" : value));

  strokeWeight(1);

  let noiseScale = noiseParams.noiseScale;
  let maxHeight = noiseParams.maxHeight;

  for (let i = 0; i < cumulativeFreq.length; i++) {
    if (rand < cumulativeFreq[i]) {
      ambientMaterial(color(theme[i]));

      let noise =
        (simplexNoise.noise2D(noiseScale * x, noiseScale * y) + 1) / 2;
      let zHeight = noise * maxHeight;

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
