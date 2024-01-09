function shapeSizeGen() {
  const dataArray = [
    { probability: 0.15, result: 50 },
    { probability: 0.15, result: 30 },
    { probability: 1, result: 10 },
  ];

  return canControl && controls.shapeSize ? controls.shapeSize : cdf(dataArray);
}
