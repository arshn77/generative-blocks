function simplexNoiseParamGen() {
  const dataArray = [
    { probability: 0.05, result: { noiseScale: 0.5, maxHeight: 370 } },

    {
      probability: 0.25,
      result: { noiseScale: 0.002, maxHeight: getRand(170, 340) },
    },
    {
      probability: 0.25,
      result: { noiseScale: 0.005, maxHeight: getRand(170, 340) },
    },
    {
      probability: 1,
      result: { noiseScale: 0.009, maxHeight: getRand(170, 340) },
    },
  ];

  // console.log(
  //   "SIMPLEX NOISE PARAM GEN",
  //   canControl && controls.simplexNoiseParam
  //     ? controls.simplexNoiseParam
  //     : dataArray
  // );

  // console.log("canControl", canControl);

  return canControl && controls.simplexNoiseParam
    ? controls.simplexNoiseParam
    : cdf(dataArray);
}
