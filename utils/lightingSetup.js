function lightingSetup() {
  // ambientLight(100);
  const lightVal = 255;

  directionalLight(200, 200, 200, 0.5, -0.5, -1);
  directionalLight(150, 150, 150, -0.5, 0.5, 1);
  // lights();
  ambientLight(230);

  rotateX(PI / 2);

  push();
  ambientMaterial(255);
  translate(200, 200, -1);
  box(width - 1, height - 1, 1);
  pop();
  // rect(width / 2, height / 2, width - 1, height - 1);
}
