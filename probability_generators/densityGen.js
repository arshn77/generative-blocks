// Have to re-edit values for diff shape sizes
function densityGen(shapeSize) {
  const dataArray = [
    // Density is in form of [minDistance, maxDistance, tries]
    { probability: 0.1, result: [13, 14, 200] }, // very packed
    { probability: 0.03, result: [25, 40, 30] }, // not packed
    {
      probability: 1,
      result: [getRand(10, 18), getRand(14, 30), getRand(40, 200)],
    }, // in-between
  ];

  return canControl && controls.density ? controls.density : cdf(dataArray);
}
