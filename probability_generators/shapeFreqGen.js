function shapeFreqGen() {
  const dataArray = [
    // In form of four different frequencies
    { probability: 0.05, result: [1, 0, 0, 0] }, // one shape
    { probability: 0.05, result: [0.5, 0.5, 0, 0] }, // two shape
    { probability: 0.05, result: [0.7, 0.3, 0, 0] }, // two shape 70/30
    { probability: 0.1, result: [0.33, 0.33, 0.34, 0] }, // three shape
    { probability: 1, result: [0.25, 0.25, 0.25, 0.25] }, // four shape
  ];

  let result = cdf(dataArray);

  // Frequencies shuffled before return
  return canControl && controls.shapeFreq
    ? controls.shapeFreq
    : shuffleArray(result);
}
