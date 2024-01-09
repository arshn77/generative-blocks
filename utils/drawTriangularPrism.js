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
