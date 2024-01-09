function numShapesGen() {
  const dataArray = [
    { probability: 0.05, result: 1 },
    // { probability: 0.01, result: getRand(2, 5) },
    { probability: 1, result: "any" },
  ];

  return canControl && controls.numShapes ? controls.numShapes : cdf(dataArray);
}
