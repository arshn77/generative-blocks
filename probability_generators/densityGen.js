function densityGen(s /*shapeSize*/) {
  const dataArray = [
    // Density is in form of [minDistance, maxDistance, tries]
    { probability: 0.1, result: [s * 1.3, s * 1.4, 200] }, // very packed
    { probability: 0.03, result: [s * 2.5, s * 4, 30] }, // not packed
    {
      probability: 1,
      result: [
        getRand(s * 1.3, s * 1.8),
        getRand(s * 1.4, s * 3),
        getRand(40, 200),
      ],
    },
  ];

  return canControl && controls.density ? controls.density : cdf(dataArray);
}
