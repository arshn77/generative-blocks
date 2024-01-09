function themeGen() {
  const dataArray = [
    // Names tbd, format [circle, square, tri, diam, strokeWeight]
    { probability: 0.1, result: ["white", "white", "white", "white", 0.2] }, //
    { probability: 0.1, result: ["black", "black", "black", "black", 0] }, //
    {
      probability: 0.1,
      result: [...shuffleArray(["blue", "red", "yellow", "purple"]), 0],
    }, //
    {
      probability: 0.1,
      result: [...shuffleArray(["black", "red", "black", "red"]), 0],
    }, //
    { probability: 1, result: ["blue", "red", "yellow", "purple", 0] }, //
  ];

  console.log("theme");
  console.log(cdf(dataArray));

  return canControl && controls.theme ? controls.theme : cdf(dataArray);
}
