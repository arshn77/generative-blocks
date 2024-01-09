function densityGen(s /*shapeSize*/) {
  const dataArray = [
    // Density is in form of [minDistance, maxDistance, tries]
    // minDistance and maxDistance will be multiplied by size, that's why they're decimals
    { probability: 0.1, result: [1.3, 1.4, 200] }, // very packed
    { probability: 0.03, result: [2.5, 4, 30] }, // not packed
    {
      probability: 1,
      result: [getRand(1.3, 1.8), getRand(1.4, 3), getRand(40, 200)],
    },
  ];

  return canControl && controls.density ? controls.density : cdf(dataArray);
}
