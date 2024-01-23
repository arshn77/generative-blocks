function is3DGen() {
  const dataArray = [
    { probability: 0.4, result: false },
    { probability: 1, result: true },
  ];
  // console.log(canControl && "is3D" in controls ? controls.is3D : dataArray);
  return canControl && "is3D" in controls ? controls.is3D : cdf(dataArray);
}
