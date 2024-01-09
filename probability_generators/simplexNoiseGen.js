function themeGen() {
  const dataArray = [];

  return canControl && controls.simplexNoise ? controls.theme : cdf(dataArray);
}
